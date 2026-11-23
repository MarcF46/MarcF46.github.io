# RB-026 – Praxis-Runbook: Windows startet nicht korrekt

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Support-Level:** L2 · **Erstaufnahme:** L1  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Status:** Recherchiertes und noch **nicht praktisch validiertes** Runbook. Keine Maßnahme ohne passende Berechtigung, Datensicherung und Gerätefreigabe.

> **Leitsatz:** **Phase nachweisen → Risiko prüfen → Diagnose durchführen → eine geeignete Maßnahme → vollständiger Normalstart und Anwendungsfunktion verifizieren.** Die Ursache wird nicht aus einer einzelnen Meldung geraten.

## 1. Annahme und Priorisierung

**Meldung:** „Windows startet nicht korrekt.“

- [ ] Kontakt, Gerät, Hersteller/Modell, Asset-Nummer, Standort und betroffene Arbeitsaufgabe dokumentieren.
- [ ] Ausfallzeit, geschäftliche Auswirkung, Ersatzarbeitsplatz und Anzahl betroffener Geräte erfassen.
- [ ] Letzter erfolgreicher Normalstart und erste Fehlerzeit notieren.
- [ ] Exakte Fehlerdarstellung/Stopcode/BCD-Code/BitLocker-Anzeige erfassen; falls zulässig Foto im Ticket.
- [ ] Änderungen kurz vorher: Updates, Software, Treiber, Sicherheitsprodukt, UEFI/TPM, Stromausfall.
- [ ] Laufwerkserkennung/Hardwareindikatoren aus RB-025 übernehmen; bei **No Power/No POST/No Video** zurück zu RB-025.

**Priorisierung** nicht allein nach Technikbezeichnung, sondern nach **Auswirkung und Dringlichkeit**; interne SLA beachten.

## 2. Sicherheits- und Backup-Gate – VOR Reparatur

- [ ] Physischer Defekt ausgeschlossen? SSD erkennbar, keine Hardware-Fehlercodes, keine Anzeichen für Schaden/Überhitzung?
- [ ] Besteht nachweisbarer Backup-/Recovery-Stand? Nicht synchronisierte lokale Geschäftsdaten geklärt?
- [ ] BitLocker-/Geräteverschlüsselung bekannt und **Wiederherstellungsschlüssel über autorisierte Stelle** erreichbar?
- [ ] Freigabe von Endpoint/IT-Leitung, Datensicherung und Anwenderauswirkungen (bei Bedarf) vorhanden?
- [ ] Für jede Änderung: Ausgangsstatus und Rückfallstrategie dokumentiert?

**STOP bei „Nein/Unbekannt“:** Keine schreibenden Reparaturen. Backup/Endpoint/Hardware/Security einschalten. **BitLocker-Schlüssel nie im Ticket notieren oder an Unbefugte schicken.**

## 3. Den Fehler reproduzierbar lokalisieren

Einmal den kontrollierten Start beobachten, nicht beliebig oft neu starten.

| Beobachtung | Erste Einordnung | Nächster sicherer Schritt |
|---|---|---|
| Kein Strom, kein Firmware-Logo | Noch kein belegter Windows-Fehler | RB-025 (Hardware) |
| UEFI-Meldung, SSD fehlt | Storage-/Bootmedium-Hypothese | OEM-/Hardwareteam, **kein** `chkdsk`/BCD-Eingriff |
| BCD-/Bootmanager-Fehler | Frühe Windows-Bootphase | Meldung + Systemlaufwerk klären, Starthilfe erwägen |
| Windows-Logo, Neustartschleife | Loader/Kernel/Software/Storage möglich | Stopcode, Veränderungshistorie, WinRE prüfen |
| Bluescreen/Stopcode | Kernel-/Treiber-/Storage-Pfad möglich | Vollständigen Stopcode notieren, passende technische Quelle |
| Nur schwarzer Bildschirm | Windows-Start **nicht belegt** | Video-/Externer-Monitor-Test aus RB-022/RB-025 |
| BitLocker-Abfrage | Sicherheits-/Recoveryprozess | Schlüssel-ID und Freigabe, **kein** TPM-Reset |

## 4. WinRE-Zugriff auswählen

**A. Windows oder Anmeldebildschirm erreichbar:** Über `Einstellungen → System → Wiederherstellung → Erweiterter Start` bzw. `Umschalt + Neu starten` WinRE öffnen.

**B. Windows startet nicht:** Erscheint „Automatische Reparatur“ bereits von selbst, **Erweiterte Optionen** aufrufen. Wenn nicht: nur freigegebene Recovery-Medien/OEM-Weg nutzen; **erzwungene harte Unterbrechungen nicht als Standard**.

**C. Verschlüsselung:** WinRE kann für bestimmte Optionen den BitLocker-Recovery-Key verlangen. Schlüsselbeschaffung **nur** über zuständige Unternehmenssysteme und -prozesse.

**Mögliche Menüpunkte:** `Problembehandlung → Erweiterte Optionen`: **Starthilfe**, **Starteinstellungen**, **Updates deinstallieren**, **Systemwiederherstellung**, **Eingabeaufforderung**. Abweichungen nach Build/Hersteller/Richtlinie dokumentieren.

## 5. Diagnosepfad A – BCD / Startmanager

1. [ ] Exakte Fehlermeldung und Code sichern (z. B. möglicher BCD-Fehlercode).
2. [ ] SSD-Erkennung und OEM-Hardwarebefund prüfen. **Fehlendes Laufwerk ⇒ keine Windows-Reparatur.**
3. [ ] Nach Freigabe und Backup-/Key-Gate: `WinRE → Problembehandlung → Erweiterte Optionen → Starthilfe` verwenden.
4. [ ] Starthilfeausgabe, etwaige Log-Datei und Ergebnis dokumentieren; vollständigen Neustart prüfen.
5. [ ] Bei Fehlschlag: **L2-Bootanalyse**, keine allgemeine `bootrec`-/`bcdboot`-Befehlsserie aus dem Internet. UEFI/GPT und Legacy/MBR unterscheiden; Zielpartitionen vor jeder Änderung eindeutig identifizieren.

**Beispiel nur lesender Prüfung in autorisierter WinRE-Konsole:**

```bat
:: Aktuelle BCD-Anzeige (keine Änderung)
bcdedit /enum all

:: Volumes nur auflisten; Laufwerksbuchstaben in WinRE sind nicht garantiert gleich
diskpart
list volume
exit

:: BitLocker-Zustand erfragen, ohne Geheimnisse zu veröffentlichen
manage-bde -status
```

**Achtung:** Bei Auffälligkeiten den **konkreten** Befund mit L2/Endpoint abgleichen, bevor eine Bootpartition bearbeitet wird.

## 6. Diagnosepfad B – Windows-Logo, Neustartschleife oder BSOD

1. [ ] Vollständigen Stopcode/Fehlercode und zeitlichen Ablauf dokumentieren.
2. [ ] Falls freigegeben und technisch möglich: `WinRE → Starteinstellungen → Neu starten → Abgesicherter Modus`.
3. [ ] **Safe Mode erfolgreich?** Änderungsverlauf, Treiber, zuletzt installierte Software, Security-Produkt, Startprogramme und Systemereignisse eingrenzen.
4. [ ] **Safe Mode scheitert?** Treiber-/Kernel-/Storageursache bleibt offen. Starthilfe bzw. weitere WinRE-Analyse nach Befund, keine automatisierte Komplettreparatur.
5. [ ] Bei Update-Indiz: **Updates deinstallieren** (nur passende, tatsächlich angebotene Aktualisierung) *oder* **Systemwiederherstellung** nach genehmigter Risikoabwägung. Nicht pauschal alles zurücksetzen.
6. [ ] Nach jeder Maßnahme vollständigen **Normalstart** prüfen. Abgesicherter Modus alleine ist keine Erfolgskontrolle.

**Lesende Nachanalyse nur auf laufendem Windows/Safe Mode:**

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='System'; Id=41,6008,1001; StartTime=(Get-Date).AddDays(-14)
} -ErrorAction SilentlyContinue |
    Select-Object -First 20 TimeCreated, Id, ProviderName, Message

Get-CimInstance Win32_OperatingSystem |
    Select-Object Caption, Version, BuildNumber, LastBootUpTime

Get-Disk | Select-Object Number, FriendlyName, HealthStatus, OperationalStatus

reagentc /info
```

**Interpretation:** Event 41/6008 = ungeplanter Neustart/Shutdown-Hinweis, **nicht** Beweis einer bestimmten Ursache. PowerShell-Befehle funktionieren nicht zwangsläufig in WinRE. `Healthy` ersetzt keine OEM-Storageprüfung.

## 7. Recovery-Optionen nach Eignung auswählen

| Maßnahme | Typisches Einsatzfenster | Auswirkung / Voraussetzung |
|---|---|---|
| **Starthilfe** | Vermutete Startdatei-/Bootkonfigurationsstörung | **Schreibender Reparaturversuch**, kein Erfolgsversprechen |
| **Abgesicherter Modus** | Treiber-/Software-/Dienstproblem eingrenzen | Diagnostischer Start, normale Anwendungsfunktion eingeschränkt |
| **Updates deinstallieren** | Fehler zeitlich/technisch mit Update korreliert | Entfernt nur unterstützte/angebotene Updates; Freigabe erforderlich |
| **Systemwiederherstellung** | Geeigneter Wiederherstellungspunkt, Systemänderungen | Kann Apps/Treiber/Systemeinstellungen zurücksetzen; persönliche Dateien i. d. R. nicht |
| **Point-in-Time-Wiederherstellung (falls vorhanden)** | Passender Snapshot auf unterstütztem Windows 11 | Kann auch persönliche Dateien auf Snapshotstand zurückführen |
| **Reset / Rebuild / Clean Install** | Letzte Option nach Datensicherung und Eskalationsentscheidung | Anwendungen/Einstellungen, ggf. Datenverlust; geräteverwaltete Bereitstellung nötig |

**Unzulässige Kurzschlüsse:** `DISM /Online` in WinRE als Offline-Reparatur ausgeben; ohne Pfadprüfung `sfc` auf die falsche Installation anwenden; `bcdedit /set ...` zur Symptombeseitigung ohne Rollback; `chkdsk /f` auf verdächtiger SSD mit ungesicherten Daten.

## 8. Re-Test und Abschlusskriterien

- [ ] Kein ursprünglicher BCD-/Stop-/Reparaturfehler beim **Normalstart**.
- [ ] Windows-Benutzeranmeldung erfolgreich, erwartete Benutzerumgebung vorhanden.
- [ ] Mindestens ein zweiter kontrollierter Start, sofern betrieblich freigegeben und sinnvoll; kein erneuter Fehler.
- [ ] Systemdatum, Grundfunktionen, Laufwerkserkennung, Netzwerk, nötige Geschäftsanwendungen geprüft.
- [ ] BitLocker-Schutz-/Recoveryzustand nach Unternehmensvorgabe geprüft; **keine Geheimnisse protokolliert**.
- [ ] Geänderte Treiber-/Updateversionen und die tatsächliche Maßnahme dokumentiert.
- [ ] Melder bestätigt, dass die ursprüngliche Arbeitsaufgabe wieder möglich ist.

**Wenn keine Ursache nachgewiesen:** Ticketstatus nicht als „Ursache gefunden“ ausgeben; nach erfolgreichem Betrieb ggf. „Störung derzeit nicht reproduzierbar“ mit weiterem Monitoring nach Prozess.

## 9. Eskalation und saubere Übergabe

**Unverzüglich eskalieren bei:** SSD im UEFI fehlend, OEM-Hardwarediagnose fehlerhaft, wiederholtem STOP mit Datenverlustverdacht, fehlendem Schlüsselzugang, kritischen ungesicherten Daten, fehlender Freigabe, erfolgloser Starthilfe und unklarer Bootpartitionslage, verdächtiger Security-/Malwarelage.

**Übergabedaten:**

- [ ] Asset, Windows-Version/Build, Verschlüsselung **nur als Status**, Backup-Status.
- [ ] Vollständiger Code und Screenshot/Fehlermeldung; Zeitpunkt und letzte Änderung.
- [ ] Welche Startphase ist **belegt**, welche nur **vermutet**?
- [ ] UEFI-Laufwerkserkennung und ggf. OEM-Hardwarebefund.
- [ ] WinRE verfügbar? Starthilfe/Safe Mode getestet? **Befund/Ergebnis** statt nur „geht nicht“.
- [ ] Exakte durchgeführte Änderungen, Autorisierung und Rückfalloption.
- [ ] Offene Hypothese, zuständiges Team, gewünschte nächste Prüfung.

### Kopierbarer Muster-Ticketkommentar (fiktiv)

> **Symptom:** Windows 11 startet nach Neustart nicht normal; nach Herstellerlogo wiederholt sich ein BSOD (Stopcode dokumentiert). **Eingrenzung:** UEFI erkennt SSD, OEM-Storage-Kurztest ohne gemeldeten Fehler; WinRE verfügbar. BitLocker-Key-Zugriff und Backup durch zuständige Stelle bestätigt. **Test:** Abgesicherter Modus startet; zuletzt geänderter Drittanbietertreiber als Hypothese. **Maßnahme:** Nach Endpoint-Freigabe gezieltes Treiber-Rollback. **Prüfung:** Zwei erfolgreiche Normalstarts, Benutzeranmeldung, Netzwerk und Fachanwendung erfolgreich. **Status:** Fiktiv gelöster Übungsfall; kein produktiver Eingriff erfolgt.

## 10. Praxiswissen und Herstellerquellen

**Lerncheck ohne Hilfsmittel:**

1. Was ist der Unterschied zwischen Firmware-, Bootmanager-, Loader- und Kernelphase?
2. Warum ist ein BCD-Fehler nicht automatisch ein Beweis für beschädigte BCD-Dateien?
3. Warum werden Daten-/Backupstatus und BitLocker **vor** der ersten Reparatur geprüft?
4. Was beweist Safe Mode, und warum reicht er für den Abschluss nicht?
5. Warum darf `DISM /Online` nicht als Offline-Reparatur in WinRE verstanden werden?
6. Welche Informationen gehören in ein strukturiertes L2-Übergabeticket?

**Quellen (Microsoft, Recherche 22.11.2026):**

- Startphasen: https://learn.microsoft.com/de-de/troubleshoot/windows-client/performance/windows-boot-issues-troubleshooting
- WinRE: https://support.microsoft.com/de-de/windows/experience/backup-recovery/windows-recovery-environment
- Starthilfe: https://support.microsoft.com/de-de/windows/experience/startup-boot/startup-repair
- Abgesicherter Modus/Starteinstellungen: https://support.microsoft.com/de-de/windows/experience/startup-boot/windows-startup-settings
- Recoveryoptionen: https://support.microsoft.com/de-de/windows/experience/backup-recovery/recovery-options-in-windows
- Updates deinstallieren: https://support.microsoft.com/de-de/windows/deployment/updates-lifecycle/how-to-uninstall-a-windows-update
- Systemwiederherstellung: https://support.microsoft.com/de-de/windows/experience/backup-recovery/system-restore
- BitLocker-Recovery: https://learn.microsoft.com/de-de/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview

**Transparenz:** Recherchierte technische Anleitung, keine reale Durchführung. Ein erfolgreicher Testausgang in den Beispielen ist ausdrücklich **fiktiv**. Bis zu einer praktischen Lab-/Arbeitsplatzvalidierung ist das Runbook als vorläufig zu kennzeichnen.
