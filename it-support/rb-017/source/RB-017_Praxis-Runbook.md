# Praxis-Runbook RB-017 – Netzlaufwerk fehlt oder ist nicht erreichbar

**Kurzformat für den IT-Support · L1/L2 · Stand 08.11.2026 · Nicht praktisch validiert**  
**Beispiel:** Benutzer meldet: „`Z:` fehlt“ oder „`Z:` ist nicht erreichbar“.  
**Wichtig:** `Z:` = Zuordnung; `\\FS01\Projekte` = UNC-Freigabe; Berechtigungen sind ein dritter Prüfpunkt.

## 1. Aufnahme (L1)

- Exakte Fehlermeldung und Zeitpunkt, Benutzer, PC, Standort, LAN/WLAN/VPN erfragen.
- Ein Benutzer, eine Gruppe oder ganze Abteilung betroffen?
- Ist das Laufwerk unsichtbar, erscheint ein rotes X oder kommt „Zugriff verweigert“?
- Welcher UNC-Pfad und welcher Laufwerksbuchstabe werden erwartet?

## 2. Drei-Minuten-Entscheidung (L1)

| Befund | Weg |
|---|---|
| `Z:` fehlt, `\\FS01\Projekte` **öffnet** | Mapping/GPO/Benutzerkontext untersuchen |
| `Z:` fehlt, **UNC öffnet nicht** | DNS/VPN/TCP 445, Freigabename, Fehlertext |
| UNC meldet **Zugriff verweigert** | Authentifizierung + SMB-/NTFS-Rechte (RB-005) |
| Z: nur im **Admin-Terminal** unsichtbar | UAC-/Sitzungskontext prüfen |
| Mehrere Benutzer betroffen | Gemeinsame Störung, L2 frühzeitig informieren |

## 3. Lesende Diagnose – auf betroffenen Client im Benutzerkontext

```powershell
# Aktuelle Identität prüfen.
whoami

# Zeigt SMB-Laufwerkszuordnungen.
Get-SmbMapping | Select-Object LocalPath,RemotePath,Status

# Prüft UNC-Pfad (False ist allein nicht eindeutig).
Test-Path -LiteralPath '\\FS01\Projekte'

# Prüft Namensauflösung des Dateiservers.
Resolve-DnsName -Name 'FS01'

# Prüft TCP-Port 445 des SMB-Dienstes (nicht Freigaberechte).
Test-NetConnection -ComputerName 'FS01' -Port 445
```

**Direkt im Explorer:** `\\FS01\Projekte` öffnen und genaue Fehlermeldung notieren.

## 4. GPO-Zuordnung prüfen – wenn UNC funktioniert, aber `Z:` fehlt

```powershell
# Zusammenfassung der Benutzer-GPOs.
gpresult /scope user /r

# HTML-Bericht im Temp-Ordner des Benutzers speichern.
gpresult /scope user /h "$env:TEMP\RB017-GPResult.html"

# Nur passende Group-Policy-Preferences-Ereignisse sichten.
Get-WinEvent -FilterHashtable @{
  LogName='Application'; Id=4096,4098
  StartTime=(Get-Date).AddDays(-2)
} -ErrorAction SilentlyContinue |
  Select-Object -First 20 TimeCreated,Id,ProviderName,Message
```

**Prüfen:** GPO-Verknüpfung, betroffene OU/Benutzer, Sicherheitsfilterung, Item-Level Targeting, Drive-Maps-Eintrag, Konflikt durch Anmeldeskript, Laufwerksbuchstabe bereits belegt. **Kein reflexartiges `gpupdate /force` vor der Aufnahme der Befunde.**

## 5. Rechte prüfen – nur auf berechtigtem Dateiserver/L2

```powershell
# AUF FS01: Zugriffsregeln der SMB-Freigabe lesen.
Get-SmbShareAccess -Name 'Projekte'

# AUF FS01: NTFS-Rechte am tatsächlichen lokalen Freigabeordner.
Get-Acl -LiteralPath 'D:\Freigaben\Projekte' |
  Select-Object -ExpandProperty Access
```

**Auf dem Benutzer-PC:** `whoami /groups` für die aktuelle Gruppenmitgliedschaft. Keine pauschalen Vollzugriffsrechte vergeben.

## 6. Maßnahme und Verifikation

- **Zuordnung fehlt:** Richtlinienfehler durch Zuständige beheben oder nur nach Freigabe im richtigen Benutzerkontext Mapping einrichten.
- **Netzwerk/SMB gestört:** VPN, interne DNS-Auflösung, Route, Server/Port und Firewall im zuständigen Team untersuchen.
- **Zugriff verweigert:** Berechtigung genehmigen lassen und gezielt korrigieren.
- **Vor jeder Änderung:** Ausgangszustand erfassen; keine globale Löschung von Zuordnungen, gespeicherten Zugangsdaten oder GPO-Einstellungen.
- **Prüfung:** `Z:` zeigt auf richtige Freigabe; UNC erreichbar; Testdatei kann entsprechend freigegebener Rolle geöffnet/bearbeitet werden; Nutzer bestätigt Erfolg.

### Beispiel für eine manuelle Zuordnung (VERÄNDERND, nur freigegeben)

```powershell
# Nur im passenden Benutzerkontext und mit freiem Laufwerksbuchstaben!
# /persistent:yes speichert die Zuordnung für spätere Anmeldungen.
net use Z: \\FS01\Projekte /persistent:yes
```

## 7. Ticketabschluss / Eskalation

**Dokumentieren:** Meldung · betroffener Umfang · UNC-Ergebnis · SMB-Port · GPO-/Mapping-Status · Berechtigungsergebnis · Maßnahme · Funktionstest.

**L2**, wenn: GPO/Anmeldeskript oder Dateiserver angepasst werden muss, mehrere Benutzer betroffen, SMB/VPN/DNS-Zentralfehler, Berechtigungsänderung nur mit höherer Freigabe möglich, Sicherheitsauffälligkeit.

**Merksatz:** **Laufwerksbuchstabe ≠ erreichbare Freigabe ≠ Berechtigung.**

**Vertiefung:** `RB-017_Lernartikel.md`; RB-005 (Freigabe- und NTFS-Rechte), RB-010 (Netzwerkdiagnose). Die Herstellerquellen stehen im Lernartikel.
