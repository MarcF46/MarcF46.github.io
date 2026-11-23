# RB-027 – Praxis-Runbook: Windows Update schlägt fehl

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Level:** L1/L2 · **Betriebssystem:** Windows 11  
**Version:** 1.0 · **Recherche:** 22.11.2026  
**Status:** Aus Microsoft-Herstellerquellen abgeleitet, **nicht auf einem real gestörten Gerät validiert**. Alle Musterwerte sind fiktiv.

> **Kurzregel:** **KB + Fehlercode + Phase sichern → Updatequelle und Abhängigkeiten prüfen → Logs korrelieren → nur freigegebene Maßnahme → KB/Neustart/Arbeitsfähigkeit verifizieren.**

## 1. Ticketannahme und Priorität

- [ ] Melder, Gerät/Asset, Hersteller/Modell, Standort/Remote, Betriebssystem-Build, geschäftliche Auswirkung aufnehmen.
- [ ] **Exakte KB-/Updatebezeichnung**, Typ (Qualitätsupdate/Treiber/Featureupdate), Fehlercode und Zusatzcode erfassen.
- [ ] Screenshot von `Einstellungen → Windows Update → Updateverlauf`, Zeitpunkt und ersten Fehlerzeitpunkt sichern.
- [ ] Anzahl betroffener Geräte und zentralen Updatekanal (Windows Update / WSUS / Intune / Configuration Manager) erfragen.
- [ ] Bestehen laufende Security-Risiken oder Compliance-Fristen? Bei vielen Geräten oder kritischen Sicherheitsupdates frühzeitig Security/Endpoint einschalten.
- [ ] **RB-026-Abzweig:** Windows bootet nicht / BitLocker Recovery / Startschleife? Keine weiteren Updateversuche: Wiederherstellungspfad einsetzen.

**Kernausgabe:** `KB / Code / Phase / Build / Gerät / Zeitpunkt / Verteilungskanal / Umfang`.

## 2. Sicherheits-Gate vor Änderungen

- [ ] Supportberechtigung, Zuständigkeit und Wartungsfenster geklärt?
- [ ] Backup-/Datenschutzlage dokumentiert? BitLocker-Wiederherstellung **über autorisierten Prozess** möglich, falls erforderlich?
- [ ] Keine aktive Paketinstallation unterbrechen; keine harten Resets bei unklarem Updatefortschritt.
- [ ] Keine eigenmächtigen WSUS-, MDM-, GPO-, Proxy-, Firewall- oder Security-Änderungen.
- [ ] Keine pauschalen Reset-Skripte für `SoftwareDistribution`, `catroot2`, BITS, SIDs, Registrierungsrechte oder Windows Update Dienste.
- [ ] Neue Logs nur an freigegebenem Ort erzeugen und vor Weitergabe auf sensible Inhalte prüfen.

**Ohne Genehmigung:** nur Aufnahme und lesende Diagnose. **Mit kritischem Daten-/Bootrisiko:** an L2/Endpoint eskalieren.

## 3. Phase des Fehlers klassifizieren

| Beobachtung | Phase / Schwerpunkt | Nächste Prüfung |
|---|---|---|
| Updatesuche schlägt fehl / keine erwartete KB | **Suche / Richtlinie** | Updatequelle, Intune-/WSUS-Zuweisung, Client-Log |
| Update gefunden, Download bricht ab | **Download / Transport** | Internet, Proxy, Quell-URL, Speicher, BITS/Übermittlungsoptimierung |
| Download abgeschlossen, Installation scheitert | **Installation / Servicing** | `CBS.log`, Code, Komponentenstatus |
| Neustart erforderlich oder Rollback | **Abschluss / Reboot** | Wartungsfenster, Updateverlauf, bei Featureupdate SetupDiag |
| Fehler erst nach Neustart, Windows startet nicht | **Bootproblem** | RB-026, Backup-/Recovery-Gate |

**Achtung:** Fortschrittsanzeige und WindowsUpdate-Servicestatus allein sind keine sicheren Ursachenbeweise.

## 4. L1-Basisprüfung und Vergleich

- [ ] `winver` / Windows-Build und genaue KB aus Updateverlauf notiert.
- [ ] Netzverbindung, Uhrzeit und Stromversorgung überprüft.
- [ ] Genügend **freier Speicherplatz passend zum Update** vorhanden?
- [ ] Ist ein **Neustart ausstehend**, ohne dass aktuell noch installiert wird?
- [ ] Gerät in einem gültigen Update-Ring? Nur betreutes Einzelgerät oder mehrere betroffen?
- [ ] Wenn passend und freigegeben: Windows-11-Problembehandlung über **Hilfe anfordern** laufen lassen; Diagnoseergebnis dokumentieren.
- [ ] Ein passendes Vergleichsgerät mit **gleicher Updatequelle/Zielgruppe** heranziehen. Nur bekannte, zulässige Testgeräte verwenden.

**L1-Grenze:** Falls keine eindeutige, freigegebene Standardmaßnahme: **mit gesichertem Befund eskalieren**, nicht reparieren „auf Verdacht“.

## 5. Diagnoseinformationen nur lesen

**PowerShell (auf laufendem Windows, Berechtigungen beachten):**

```powershell
# Build und Systemzeit
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption, Version, BuildNumber, LastBootUpTime
Get-Date

# Freier Platz des Systemlaufwerks
Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'" |
  Select-Object DeviceID, @{N='FreeGiB';E={[math]::Round($_.FreeSpace/1GB,1)}}

# Update-/Transferdienste nur abfragen (Stopped ≠ automatisch Fehler)
Get-Service wuauserv,bits,cryptsvc,usosvc -ErrorAction SilentlyContinue |
  Select-Object Name,Status,StartType

# Ereignisse mit Datum, Quelle, Text; bei fehlenden Rechten an L2
Get-WinEvent -FilterHashtable @{
 LogName='Microsoft-Windows-WindowsUpdateClient/Operational'
 StartTime=(Get-Date).AddDays(-14)
} -MaxEvents 50 -ErrorAction SilentlyContinue |
  Select-Object TimeCreated,Id,LevelDisplayName,Message
```

**Client-/Enterprise-Richtlinien lesen (nicht ändern):**

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -EA SilentlyContinue
Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -EA SilentlyContinue
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\PolicyManager\current\device\Update' -EA SilentlyContinue
netsh winhttp show proxy
```

**Protokoll-Export bei Bedarf (erzeugt Datei, keine Dienstunterbrechung mit `-ForceFlush`):**

```powershell
# Nur autorisierter Ablageort; Zielname vorher auf Existenz prüfen.
Get-WindowsUpdateLog -LogPath "$env:USERPROFILE\Desktop\RB027-WindowsUpdate.log"
```

- `Get-WindowsUpdateLog` erzeugt einen **Snapshot**, keinen Live-Log. Spätere Ereignisse erfordern neuen Export.
- Ggf. `CBS.log` unter `%windir%\Logs\CBS\CBS.log` **lesend** auswerten und nur zugehörige Fehlerzeilen heranziehen.
- Featureupgrade: **SetupDiag** und Panther-/Rollback-Logs statt ausschließlicher CBS-Analyse.

## 6. Prüfpfad A – Suche oder Download gestört

1. [ ] Richtige KB/Zielgruppe/Updatequelle ermittelt? Intune-Ring/WSUS-Freigabe/Configuration Manager mit Zuständigen abgleichen.
2. [ ] Erreichbarkeit der **tatsächlichen Updatequelle** untersuchen (VPN, DNS, Proxy, TLS/Firewall); Browser-Test alleine genügt nicht.
3. [ ] Clientlogs und Transferphase zum Fehlerzeitpunkt prüfen; bei Verbindungshinweisen Netzwerk-/Proxy-Team beteiligen.
4. [ ] Freier Speicher, BITS/Delivery Optimization und Richtlinienstatus erfasst; nicht allein aus `Stopped` eine Störung ableiten.
5. [ ] **Nach bestätigter Ursache**: zugelassenen Netzwerk-/Quellenfix oder geregelte Problembehandlung einsetzen; Fehlercode/Neutest notieren.

**Stopp:** Zentral verwaltetes Gerät und falsche Scanquelle? Keine Registrierungsschlüssel löschen oder Updatequelle manuell wechseln. An Endpoint-/WSUS-/Intune-Team.

## 7. Prüfpfad B – Installation oder CBS-Fehler

1. [ ] Download erfolgreich? Exakten Installationscode aus Updateverlauf und eventuelle CBS-Einträge zeitlich verbinden.
2. [ ] Bei begründetem Komponentenspeicherverdacht nur nach L2-Freigabe zunächst prüfen:

```cmd
:: Erweiterte, zustandsprüfende Diagnose (Adminrechte, Dauer beachten)
DISM /Online /Cleanup-Image /CheckHealth
DISM /Online /Cleanup-Image /ScanHealth
```

3. [ ] Wenn eine Reparatur nach Befund sinnvoll und genehmigt ist, **vorher** Backup, geeignete Quelle und Wartungsfenster klären; dann ggf.:

```cmd
:: SCHREIBENDE Reparatur, NUR L2 nach Freigabe
DISM /Online /Cleanup-Image /RestoreHealth
sfc /scannow
```

4. [ ] `0x800F081F` im DISM-Kontext? Reparaturquelle passend zur Windows-Version prüfen. **Keine** improvisierte Quelle, keine pauschalen `SFC`/`DISM`-Wiederholungsschleifen.
5. [ ] Resultat aus CBS-/DISM-Logs festhalten, dann **nur die passende KB** über den freigegebenen Kanal erneut prüfen.

**Stopp:** SSD-/Datenträgerfehler, fehlender Reparaturzugriff, ungeklärter Backupstatus oder wiederholte komponentenbezogene Fehlermeldungen ⇒ L2/L3/Endpoint.

## 8. Prüfpfad C – Rollback, Featureupdate oder Richtlinien

- [ ] Handelt es sich um ein **Featureupdate**? SetupDiag, Panther-/Rollback-Logs und exakten Setup-Fehlercode verwenden.
- [ ] `0xC1900101` zusammen mit Setup-Befund? Treiber-/Kompatibilitätsursache prüfen, nicht wahllos Treiber entfernen.
- [ ] Mehrere Clients betroffen? Update-Ringe, GPO, MDM- und WSUS-/SUP-Zuordnung durch zuständige Stelle auswerten.
- [ ] Windows-11-Option **„Probleme mithilfe von Windows Update beheben“** ist eine weitergehende Neuinstallation derselben Version, **keine normale erste Supportmaßnahme**; auf verwalteten Geräten teils nicht verfügbar.
- [ ] Wiederholte Rollbacks oder BSOD nach Update? Ggf. Security/Endpoint und RB-026 hinzuziehen.

## 9. Verifikation und Ticketabschluss

- [ ] Exakte Ziel-KB bzw. Featureversion **als erfolgreich installiert** im Updateverlauf nachweisbar.
- [ ] Notwendiger Neustart vollständig abgeschlossen; Anmeldung und arbeitsrelevante Anwendungen funktionieren.
- [ ] Nach einem erneuten Updatecheck **derselbe Fehler nicht erneut** aufgetreten; bei Ringen/WSUS zentrale Meldelatenz berücksichtigen.
- [ ] Nachher-Befund (Build, KB, Fehlerfreiheit, Dauer, Geräteumfang) gesichert.
- [ ] **Vorher → Maßnahme → Nachher** lückenlos im Ticket dokumentiert.
- [ ] Melder informiert; bei ungelöstem Risiko, Compliance-Frist oder Massenstörung an zuständige Stelle eskaliert.

**Erfolg ≠** „Balken bei 100 %“ oder „Updatefenster geschlossen“. **Erfolg = Zielupdate installiert und gewünschte Funktion kontrolliert.**

### Kopierfertiger Muster-Ticketkommentar (fiktiv)

> **Störung:** Windows 11, Build [Nummer], Qualitätsupdate [KB], Installation fehlgeschlagen am [Zeitpunkt] mit [Fehlercode]. Download laut Updateverlauf abgeschlossen; [n] Geräte betroffen.  
> **Diagnose:** Ereignisprotokoll WindowsUpdateClient und zugehörige CBS-Einträge [Befund/Zeitfenster] korreliert. Speicherplatz [x GiB], Quelle [WSUS/Intune/Windows Update]. Hypothese [begründet, noch nicht endgültig bewiesen].  
> **Maßnahme:** [Nur tatsächlich ausgeführte und genehmigte Schritte], Referenz [Freigabe/Ticket].  
> **Kontrolle:** [KB] nach erneutem Vorgang installiert/nicht installiert, Neustart [ja/nein], Anwendungen [ok/offen].  
> **Status:** [gelöst / an Endpoint-L2 eskaliert] mit [relevanten Befunden/Logs], kein unautorisierter Eingriff in Richtlinien.

## 10. Kompetenzcheck, Eskalation, Herstellerquellen

**Drei Fragen ohne Unterlagen:**

1. An welchem Artefakt erkennst du, ob ein Fehler im Download oder im **CBS-Servicing** liegt?
2. Welcher zusätzliche Diagnoseweg gilt bei einem **Funktionsupdate** mit Rollback?
3. Ein Client zeigt „keine Updates“, WSUS weist aber keine KB zu. Welches Team muss handeln und warum?

**An L2/Endpoint übergeben:** `KB + Build + Code + Phase + Log-Zeitfenster + GPO/MDM/WSUS-Quelle + Geräteumfang + A/B-Test + Sicherheits-/Backupprozess + versuchte Schritte`.

**Offizielle Quellen, eingesehen am 22.11.2026:**

- https://support.microsoft.com/de-de/windows/experience/windows-update-troubleshooter
- https://support.microsoft.com/de-de/windows/deployment/updates-lifecycle/troubleshoot-problems-updating-windows
- https://learn.microsoft.com/de-de/windows/deployment/update/how-windows-update-works
- https://learn.microsoft.com/de-de/windows/deployment/update/windows-update-logs
- https://learn.microsoft.com/de-de/powershell/module/windowsupdate/get-windowsupdatelog
- https://learn.microsoft.com/de-de/troubleshoot/windows-server/installing-updates-features-roles/fix-windows-update-errors
- https://learn.microsoft.com/de-de/windows/deployment/update/wufb-wsus
- https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-protection/troubleshoot-update-rings
- https://learn.microsoft.com/de-de/windows/deployment/upgrade/setupdiag
- https://support.microsoft.com/en-gb/windows/deployment/install-upgrade/fix-issues-by-reinstalling-the-current-version-of-windows

**Transparenz:** Recherchierte Vorgehensweise, noch keine praktische Funktionsprüfung. Alle Beispiele sind fiktiv. Eine Unternehmensfreigabe zur Durchführung wird durch dieses Runbook **nicht** ersetzt.
