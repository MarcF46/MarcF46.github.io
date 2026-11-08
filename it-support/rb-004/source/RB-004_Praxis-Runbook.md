# RB-004 – Praxis-Runbook: Anwendung startet nicht oder stürzt ab

**Zweck:** Kompakte Arbeitsanweisung für L1/L2 · **Version:** 1.0 · **Stand:** 07.11.2026  
**Status:** Technisch recherchiert, praktische Validierung ausstehend. **Vor Anwendung:** Unternehmensrichtlinien und erforderliche Berechtigungen prüfen.

## 1. Ticket aufnehmen (L1)

- [ ] Exakte Anwendung, Version, Computername, Benutzer und Meldung notieren.
- [ ] Beginn und letzte Änderungen (Update, Add-in, Profil, Netz) erfragen.
- [ ] Klassifizieren: **startet nicht / stürzt ab / hängt**.
- [ ] Betroffenheit feststellen: ein Benutzer, ein PC oder mehrere Geräte?
- [ ] Auswirkungen und mögliche ungespeicherte Daten klären.

## 2. Geeigneten Zugriff bestimmen

| Benutzer kann sich anmelden | Gemeinsame Diagnose via Bildschirmfreigabe/Fernwartung, sofern erlaubt |
|---|---|
| PC erreichbar, interaktive Sitzung nötig | Eigene RDP-Sitzung, falls freigegeben (kein gemeinsames Bildschirmteilen) |
| PC erreichbar, Remote-Befehle eingerichtet | PowerShell-Remoting/WinRM nach Freigabe |
| PC nicht erreichbar | Telefon-/Vor-Ort-Diagnose; zentrale Systemprüfung |

## 3. Drei erste technische Checks (L1)

1. **Reproduzieren**, genaue Uhrzeit notieren; bei Datenverlustgefahr nicht erneut starten.
2. **Zuverlässigkeitsverlauf:** `perfmon /rel` und **Ereignisanzeige:** `eventvwr.msc` → Windows-Protokolle → Anwendung → Zeitpunkt / Quellen `Application Error` (häufig ID 1000), `Windows Error Reporting` (häufig ID 1001).
3. **Task-Manager:** Läuft der Prozess? Stürzt er direkt ab oder reagiert er nicht? Andere Benutzer/Geräte zum Vergleich heranziehen.

## 4. Optionale PowerShell-Prüfungen (lesend)

**Ausführungsort:** betroffener Client oder autorisierte Remoteausführung. `InventarClient` und `InventarSync` sind **Platzhalter**.

```powershell
# Prüft, ob die Anwendung momentan als Prozess läuft.
Get-Process -Name 'InventarClient' -ErrorAction SilentlyContinue

# Sucht Fehlerereignisse (ID 1000) der letzten 24 Stunden.
Get-WinEvent -FilterHashtable @{
    # Windows-Anwendungsprotokoll.
    LogName = 'Application'
    # Häufige Ereignis-ID für Anwendungsabstürze.
    Id = 1000
    # Zeitraum der Suche.
    StartTime = (Get-Date).AddHours(-24)
} -ErrorAction SilentlyContinue |
# Relevante Metadaten anzeigen.
Select-Object -First 20 TimeCreated, ProviderName, Id, Message

# Optional: Abhängigen Dienst prüfen, NUR wenn dokumentiert.
Get-Service -Name 'InventarSync' -ErrorAction SilentlyContinue
```

**Befund sichern:** Uhrzeit, `Faulting application`, `Faulting module`, Exception Code, Status. Ein Modulname beweist nicht automatisch die tatsächliche Ursache. Keine Treffer schließen den Fehler nicht aus.

## 5. Entscheidung → Maßnahme

| Befund | Vorgehen |
|---|---|
| Nur Benutzer betroffen | Benutzerprofil / App-Einstellungen eingrenzen; keine Daten ohne Backup zurücksetzen |
| Viele Benutzer betroffen | Gemeinsame Infrastruktur/Rollout prüfen; Störung eskalieren |
| Crash nach Add-in-Update | Herstellerhinweise prüfen; Erweiterung ggf. kontrolliert und reversibel deaktivieren |
| Reparaturfunktion vorhanden | Nach Freigabe **Reparieren** statt pauschal neu installieren; anschließend testen |
| Fehlender Dienst / Server | Dienstzustand, Netzwerk und Serverstatus gezielt prüfen; verantwortliches Team informieren |
| Fehler bleibt ungeklärt | Logs sichern und an L2/Hersteller übergeben |

**NICHT blind:** `Stop-Process -Force`, „Zurücksetzen“, Profil löschen, DLL ersetzen, Firewall/Defender deaktivieren, `sfc`/`DISM` als allgemeine Erstmaßnahme. Änderungen können Daten oder Systemzustand beeinflussen.

## 6. Erfolgskontrolle und Ticketabschluss

- [ ] Anwendung startet unter dem **betroffenen Benutzer**.
- [ ] Ursprünglicher Arbeitsablauf (z. B. Inventarbuchung) funktioniert.
- [ ] Keine unmittelbar erneuten Abstürze im Test; Logs geprüft.
- [ ] Ursache **als bestätigt oder vermutet** korrekt bezeichnet.
- [ ] Ticket mit Befund, Maßnahme, Funktionstest und eventuellen offenen Punkten dokumentiert.

**Eskalation an L2:** Viele Betroffene, wiederkehrende Crashs, Datenverlust, Sicherheitsbezug, komplexe Laufzeit-/Systemprobleme oder Dumpanalyse. Mitgeben: Zeit, PC, Benutzer, App-Version, genaue Reproduktionsschritte, Eventlogs und bereits versuchte Maßnahmen (ohne Geheimnisse).

## 7. Quellen

- [Microsoft – Application/service crash troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior)
- [Microsoft – Get-WinEvent](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent?view=powershell-5.1)
- [Microsoft – perfmon /rel](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/perfmon)
- [Microsoft – Apps reparieren](https://support.microsoft.com/de-de/windows/apps/repair-apps-and-programs-in-windows)

**Mehr Hintergründe:** `RB-004_Lernartikel.md` · **Beispielstatus:** Nicht praktisch durchgeführt.
