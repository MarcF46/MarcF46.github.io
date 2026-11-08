# RB-018 – Praxis-Runbook: Netzwerkdrucker wird nicht gefunden

**Kategorie:** Druckerbereitstellung · **Level:** L1/L2 · **Version:** 1.0 · **Datum:** 08.11.2026  
**Status:** Recherchierte Arbeitsanweisung, nicht im Unternehmensnetz validiert.  
**Beispiel:** Client Windows 11, Printserver `PRINT01`, Drucker `\\PRINT01\Buero` (fiktiv).

> **Ziel:** Ursache lokalisieren: Fehlende Zuordnung/Suche, Netzwerk/Printserver, Treiber/Point and Print oder Berechtigung. Anschließend genehmigte Maßnahme und Testdruck.

## 1. Ticket aufnehmen – vor dem ersten Befehl

- Exakte Fehlermeldung bzw. Fehlercode und Zeitpunkt notieren.
- Betroffen: **ein Benutzer, ein Gerät oder mehrere Mitarbeiter/Standorte**?
- Fehlt der Drucker in der Liste oder ist er sichtbar, druckt aber nicht? **Wenn sichtbar und Druckauftrag hängt → RB-008.**
- Printserver und tatsächlichen Freigabenamen, Standort, Unternehmens-VPN und bekannte Änderungen erfragen.
- Prüfen, ob die Druckerverbindung über GPO/Unternehmenssoftware oder manuell vorgesehen ist.

## 2. Klare Fehlerverzweigung

| Befund | Sofortige Richtung |
|---|---|
| Drucker fehlt, `\\PRINT01\Buero` funktioniert | Zuweisung/GPO, Benutzerkontext, Druckersuche |
| Drucker fehlt, Printservername wird nicht aufgelöst | DNS, VPN, Namensfehler |
| Printserver erreichbar, Verbindung bricht ab | RPC-/Spooler-/Freigabe-Zugriff untersuchen |
| Treiberabfrage/Administratoraufforderung | Point-and-Print-Sicherheit und Treiberfreigabe untersuchen |
| Drucker verbindet, Zugriff verweigert | Druckersicherheit und Rollen/Berechtigungen prüfen |
| Drucker installiert, Aufträge hängen | Weiter zu RB-008 |

## 3. Erste Clientprüfungen (nur lesen)

**Auf:** Client, möglichst im Kontext des betroffenen Benutzers.

```powershell
# Zeigt die bekannten lokalen Drucker und Druckerverbindungen.
Get-Printer | Select-Object Name, DriverName, PortName

# Prüft den Druckerwarteschlangendienst auf diesem Client.
Get-Service -Name Spooler

# Löst den Printservernamen in die konfigurierte IP-Adresse auf.
Resolve-DnsName -Name 'PRINT01'

# Prüft den RPC Endpoint Mapper über TCP 135.
Test-NetConnection -ComputerName 'PRINT01' -Port 135
```

**Wichtig:** Ein Erfolg bei TCP 135 garantiert nicht den Zugriff auf die weiteren RPC-Druckports. Ein Test von TCP 445 wäre nur ein zusätzlicher SMB-Test; er ersetzt die RPC-Prüfung nicht.

## 4. Direkte Verbindung und GPO prüfen

**Auf:** Client, in der betroffenen Benutzersitzung. Zuerst Explorer mit `Win + E` öffnen und den Pfad `\\PRINT01\Buero` in die Adressleiste eingeben. **Nicht** als Dateifreigabe oder Laufwerk missverstehen: Der Pfad bezeichnet hier eine Druckerwarteschlange.

```powershell
# Zeigt an, welche Benutzer-GPOs beim angemeldeten Benutzer greifen.
gpresult /scope user /r

# Erstellt einen HTML-Bericht für weitere GPO-Diagnose.
gpresult /scope user /h "$env:TEMP\RB018-GPResult.html" /f
```

Falls direkte Verbindung klappt, die automatische Zuweisung aber fehlt: GPO-Link, Sicherheits-/Zielgruppenfilter, Benutzer-/Computerkontext und den tatsächlich freigegebenen Namen prüfen. **Kein blindes `gpupdate /force`** auf einem produktiven Client; Richtlinienaktualisierung kann mehr als nur Druckereinstellungen ändern.

## 5. L2 – Printserver, Treiber, Logs

**Auf:** Berechtigtem Administrationsrechner mit Zugriff auf `PRINT01` beziehungsweise direkt auf dem Printserver.

```powershell
# Fragt die Warteschlangen und Freigaben auf PRINT01 ab.
Get-Printer -ComputerName 'PRINT01' |
    Select-Object Name, ShareName, Shared, DriverName, PortName

# Zeigt serverseitig bekannte Treiber.
Get-PrinterDriver -ComputerName 'PRINT01' |
    Select-Object Name, Manufacturer, PrinterEnvironment

# Auf dem jeweils untersuchten Windows-Rechner:
# Zeigt Fehler aus dem Druckverwaltungsprotokoll der letzten 4 Stunden.
Get-WinEvent -FilterHashtable @{
    LogName = 'Microsoft-Windows-PrintService/Admin'
    StartTime = (Get-Date).AddHours(-4)
} -ErrorAction SilentlyContinue |
    Select-Object -First 15 TimeCreated, Id, Message
```

**Point and Print:** Treiberinstallation vom Server kann standardmäßig Administratorrechte benötigen. Kein Sicherheitsniveau herabsetzen, nur um eine Verbindung herzustellen. Fehler **4098** im *Anwendungsprotokoll* kann auf fehlerhafte Drucker-GPOs hinweisen, **215** in PrintService/Admin auf Treiberinstallation – jeweils Meldung und Code auswerten.

## 6. Maßnahme und Erfolgskontrolle

- **Nur die nachgewiesene Ursache beheben:** GPO/Filter korrigieren, korrekten Pfad verwenden, DNS/RPC/Firewall durch zuständiges Team reparieren, genehmigten Treiber bereitstellen oder Berechtigung nach Freigabe setzen.
- **Verändernde Beispielaktion – nur nach Freigabe und Pfadprüfung:**

```powershell
# VERÄNDERT die Clientkonfiguration: fügt einen Netzwerkdrucker hinzu.
# Ein benötigter Treiber kann Administratorrechte erfordern.
Add-Printer -ConnectionName '\\PRINT01\Buero'
```

- Abschließend: Drucker in Windows sichtbar? Aus gewünschter Anwendung auswählbar? Testseite druckbar? Richtige Warteschlange, keine Fehlermeldung, Benutzer bestätigt den Erfolg?
- Keine globalen Drucksicherheitsrichtlinien ausschalten und **keinen Printserver-Spooler auf Verdacht neu starten**.

## 7. Ticketabschluss oder Eskalation

**Tickettext (Vorlage):**

> **Fehlerbild:** [Drucker fehlt / Installation scheitert, genauer Wortlaut].  
> **Umfang:** [Benutzer/Geräte/Standorte].  
> **Befunde:** [UNC-Druckerpfad, DNS, TCP 135, GPO, Freigabe, Treiber, Ereignis-IDs].  
> **Ursache:** [nachgewiesen oder weiterhin offen].  
> **Maßnahme:** [genehmigte Änderung].  
> **Erfolgskontrolle:** [Drucker sichtbar, Testdruck, Benutzerbestätigung].  
> **Status:** [gelöst/eskaliert].

**Eskalieren:** Wenn Printserver, Netzwerk-/RPC-Ports, zentrale GPO, Treiberpakete oder sicherheitsrelevante Druckerberechtigungen betroffen sind; gegebenenfalls sofort bei mehreren betroffenen Benutzern.

## 8. Referenzen

- [Microsoft: Windows 11 – Druckkommunikation via RPC](https://learn.microsoft.com/de-de/troubleshoot/windows-client/printing/windows-11-rpc-connection-updates-for-print)
- [Microsoft: KB5005652 – Point and Print](https://support.microsoft.com/de-de/servicing/os/windows/2021/08/kb5005652-manage-new-point-and-print-default-driver-installation-behavior-cve-2021-34481)
- [Microsoft: Get-Printer](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printer)
- [Microsoft: Add-Printer](https://learn.microsoft.com/en-us/powershell/module/printmanagement/add-printer)
- [Microsoft: gpresult](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/gpresult)
- [Microsoft: Druckerzuweisungs-/Treiberfehler](https://learn.microsoft.com/de-de/troubleshoot/windows-server/printing/event-ids-associated-point-print-restrictions)

**Dokumentationsstatus:** Illustratives Verfahren ohne tatsächlichen Lab-/Produktionstest. Für firmeneigene Umgebungen an reale Rollen, Druckserverarchitektur und Freigaben anpassen.
