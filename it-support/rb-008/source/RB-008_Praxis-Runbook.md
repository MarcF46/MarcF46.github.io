# RB-008 – Praxis-Runbook: Drucker druckt nicht

**Zweck:** Kompakte Diagnosecheckliste für L1/L2 · **Version:** 1.0 · **Stand:** 08.11.2026  
**Status:** Recherchiertes Vorgehen, praktische Validierung ausstehend · **Geltungsbereich:** Windows-Clients, optional Windows-Printserver.

## 1. Ticketaufnahme (L1)

- [ ] Benutzer, Computername, Druckername/Freigabe und Zeitpunkt erfassen.
- [ ] Exaktes Symptom: Kein Auftrag? Auftrag hängt? Offline? Ausgabe falsch? Auftrag angeblich erfolgreich?
- [ ] Eine Anwendung oder alle? Ein Benutzer oder mehrere? Anderer Drucker funktioniert?
- [ ] Gerät vor Ort: Papier/Toner, Fehlercode, Status, ggf. Secure Print (Freigabe durch PIN/Karte)?
- [ ] Drucker direkt per USB/Netzwerk oder über `\\PRINT01\Buero-2OG` eingebunden?
- [ ] Fernwartung/Teams-Bildschirmfreigabe, Vor-Ort-Besuch oder autorisierter Serverzugriff verfügbar?

## 2. Fehlerlokalisierung (L1)

| Befund | Nächste Prüfung |
|---|---|
| Drucker-Selbsttest scheitert | Gerät, Papier, Wartung, Herstellerfehler. |
| Nur ein Programm druckt nicht | Vergleichstest aus Editor und Windows-Testseite; Anwendung/Dokument. |
| Ein Client betroffen | Lokale Druckwarteschlange, Spooler, Druckerobjekt, Treiber. |
| Mehrere betroffen | Druckerdisplay, Printserver, zentraler Dienst, Netzwerk. |
| Client-Auftrag vorhanden, Server-Auftrag fehlt | Client/Verbindung/Printserver-Zugang. |
| Auftrag auf Printserver vorhanden, Drucker bleibt stumm | Server-Spooler, Port, Netzwerkpfad zum Drucker, Gerät. |
| Auftrag verschwindet und kommt nicht raus | Richtiges Gerät, Secure Print, Fach, Logs, Port. |

**Abkürzungen:** RDP = Remote Desktop Protocol; DNS = Domain Name System; TCP = Transmission Control Protocol; IP = Internet Protocol; GPO = Group Policy Object; WinRM = Windows Remote Management; IPP = Internet Printing Protocol.

## 3. Lesende Diagnose (Client)

**Auf dem betroffenen Windows-Client:**

```powershell
# Zeigt alle lokalen/verbundenen Drucker und den Port an.
Get-Printer | Select-Object Name, PrinterStatus, DriverName, PortName

# Druckername mit dem tatsächlichen Anzeigenamen ersetzen.
$drucker = 'Buero-2OG'

# Zeigt die Druckjobs dieser Warteschlange ohne Änderungen.
Get-PrintJob -PrinterName $drucker |
    Select-Object ID, UserName, DocumentName, JobStatus

# Prüft den lokalen Windows-Druckspooler.
Get-Service -Name 'Spooler' |
    Select-Object Name, Status, StartType
```

**Auf dem berechtigten Administrationsrechner, falls Printserver eingesetzt:**

```powershell
# Liest die Drucker auf dem zentralen Server.
Get-Printer -ComputerName 'PRINT01' |
    Select-Object Name, PrinterStatus, PortName, DriverName

# Liest dort die Aufträge einer konkreten Warteschlange.
Get-PrintJob -ComputerName 'PRINT01' -PrinterName 'Buero-2OG' |
    Select-Object ID, UserName, DocumentName, JobStatus

# Liest Ports auf dem Druckserver.
Get-PrinterPort -ComputerName 'PRINT01' |
    Select-Object Name, PrinterHostAddress, PortNumber
```

**Bei Standard-TCP/IP-RAW-Port 9100 (nur wenn so konfiguriert):**

```powershell
# Dokumentations-IP durch echte Drucker-IP ersetzen!
# Vom Printserver bzw. relevanten Ausgangssystem aus prüfen.
Test-NetConnection -ComputerName '192.0.2.45' -Port 9100
```

`TcpTestSucceeded : True` beweist lediglich TCP-Erreichbarkeit – **keinen erfolgreichen Druck**. Bei USB, WSD oder IPP andere Prüfschritte wählen.

## 4. Gezielte Maßnahmen (nach Befund und Freigabe)

- [ ] Papierstau/Materialproblem entsprechend Herstellerhinweis beheben.
- [ ] Bei einem blockierten Job **Besitzer und Dokument** klären; nur den betroffenen Auftrag entfernen.
- [ ] Bei nachgewiesenem lokalen Spoolerproblem Ereignisse sichern und kontrollierten Dienst-Neustart erwägen.
- [ ] Server-Neustart des Spoolers nur mit L2-Freigabe, Betroffeneninformation und Auswirkungsprüfung.
- [ ] Treiber/Port/GPO nur nach Versions- und Sicherheitsprüfung ändern; Unternehmensrichtlinien nicht umgehen.

**Simulation für gezieltes Entfernen eines Druckjobs:**

```powershell
# Beispiele an tatsächlichen Drucker und Auftrag anpassen.
$drucker = 'Buero-2OG'
$auftragId = 17

# Prüft Auftrag vor einer Änderung.
Get-PrintJob -PrinterName $drucker -ID $auftragId

# Zeigt an, was entfernt würde – ohne den Job zu löschen.
Remove-PrintJob -PrinterName $drucker -ID $auftragId -WhatIf

# NUR nach Autorisierung: Remove-PrintJob -PrinterName $drucker -ID $auftragId
```

**Simulation eines Spooler-Neustarts:**

```powershell
# Greift nur auf dem System, auf dem dieser Befehl ausgeführt wird.
# -WhatIf soll die Maßnahme lediglich anzeigen.
Restart-Service -Name 'Spooler' -WhatIf

# NUR bei Freigabe: Restart-Service -Name 'Spooler'
```

**Kein Standardverfahren:** Pauschales Löschen aus `%windir%\System32\spool\PRINTERS` oder ungeplantes Neustarten des zentralen Spoolers. Auf Printservern können dadurch Druckjobs vieler Mitarbeitender betroffen sein.

## 5. Funktionsnachweis

- [ ] Kleine, unkritische Testseite erfolgreich an den **richtigen** Drucker gesendet.
- [ ] Papier tatsächlich ausgegeben oder durch Benutzer verifiziert (nicht nur „Job beendet“).
- [ ] Ursprüngliche Anwendung kann erneut drucken.
- [ ] Bei Mehrbenutzerstörung mindestens einen zweiten Arbeitsplatz prüfen.
- [ ] Keine fremden Druckaufträge/Datenschutzanforderungen unzulässig beeinträchtigt.

## 6. Eskalation L1 → L2

Eskalieren bei: Mehrbenutzer- oder Mehrdrucker-Störung, Printserver-Queue/Spooler, Treiber-/GPO-Sicherheitsrichtlinien, Netzwerk-Routing/Firewall, wiederkehrendem Absturz, fehlenden Berechtigungen oder Hardware-/Firmwaredefekt.

**Übergabe:** betroffene Clients/Drucker, Zeit, exakte Meldung, Queue-Status **Client vs. Server**, Gerätedisplay, Tests und Ergebnisse, Änderungen, Risiken und Ansprechpartner.

## 7. Muster-Ticket (fiktiv)

**INC-008 · Windows-Druckauftrag bleibt lokal hängen**  
**Diagnose:** Ein Benutzer betroffen; Drucker und Printserver bei Kollegen funktionsfähig. Auftrag nur lokal im Client sichtbar.  
**Maßnahme:** Nach Zustimmung einzelnen blockierten Auftrag entfernt; erneuten Testdruck durchgeführt.  
**Ergebnis:** Testseite und Originalanwendung drucken wieder. Technische Ursache des ursprünglichen Jobs nicht abschließend nachgewiesen.  
**Status:** Gelöst – fiktive Übung, kein echter Praxisnachweis.

## 8. Referenzen

- [Microsoft – Troubleshooting scenarios for printing](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/troubleshoot-printing-scenarios)
- [Microsoft – PrintManagement-Modul](https://learn.microsoft.com/de-de/powershell/module/printmanagement/)
- [Microsoft – Get-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printjob)
- [Microsoft – Remove-PrintJob](https://learn.microsoft.com/en-us/powershell/module/printmanagement/remove-printjob)
- [Microsoft – Print Spooler service not running](https://learn.microsoft.com/en-us/troubleshoot/windows-server/printing/print-spooler-service-not-running)
- [Microsoft – Windows Protected Print Mode](https://learn.microsoft.com/en-us/windows/modern-print/windows-protected-print-mode/windows-protected-print-mode)

**Status:** Dokumentation recherchiert; Praxistest ausstehend. Details und Grundlagen siehe [RB-008 Lernartikel](RB-008_Lernartikel.md).
