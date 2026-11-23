# RB-025 – Praxis-Runbook: Computer startet nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Zielumgebung:** Windows-11-Arbeitsplätze (Notebook, Desktop, All-in-One), herstellerabhängige UEFI-/POST-Verfahren  
**Level:** L1/L2 · **Version:** 1.0 · **Stand:** 22.11.2026  
**Status:** Recherchierte Arbeitsanweisung; **praktische Laborvalidierung ausstehend**.

> **Einsatzregel:** Erst dokumentieren, **welche Startphase tatsächlich nicht funktioniert**. Kein Windows-Recovery, wenn ein Strom- oder POST-Fehler wahrscheinlich ist. Bei Brand-/Flüssigkeitsschaden Tests abbrechen. Keine Neuinstallation, TPM-/Secure-Boot-Änderung oder Firmware-Reparatur ohne Freigabe.

![RB-025 – technischer Diagnosebaum](assets/rb025_diagnosebaum.svg)

## 1. Ticketaufnahme und Priorisierung (L1)

- [ ] Anwender, Standort, Inventarnummer, **Hersteller/Modell**, Desktop/Notebook, Zeitpunkt und Geschäftsbeeinträchtigung erfassen.
- [ ] Wann startete der Rechner zuletzt erfolgreich? Gab es **Update, Stromausfall, Sturz, Flüssigkeit, Transport, neue Peripherie**?
- [ ] **Startbild wörtlich** dokumentieren: keine Reaktion, Lüfter/LEDs, Beep-/Blinkcode, Herstellerlogo, Windows-Logo, Fehlermeldung, BitLocker-Abfrage oder Reparaturbildschirm.
- [ ] Ist nur **der Bildschirm** schwarz oder fehlen alle Lebenszeichen? Internes Notebookdisplay und externer Monitor getrennt beobachten.
- [ ] Kritische lokale Daten, Datensicherung, Verschlüsselung, Ersatzarbeitsplatz und SLA/Priorität klären.
- [ ] Bei Wärme, Brandgeruch, aufgedunsenem Akku, Flüssigkeit: **STOP**, keine weiteren Startversuche, Gefahrenlage gemäß Unternehmensanweisung melden.

**Startbild-Entscheidungsraster:**

| Beobachtung | Arbeitshypothese | Direkt weiter zu |
|---|---|---|
| Keine erkennbare Einschaltreaktion | No Power | Abschnitt 3 |
| LEDs/Lüfter; kein normaler Start; Beep-/Blinkmuster | Verdacht No POST | Abschnitt 4 |
| LEDs/Lüfter; kein Bild, aber möglicher Systemlauf | No Video **oder** No POST unklar | Abschnitt 5 |
| Firmware-/Herstellerphase wird verlassen; Windows startet nicht | Verdacht No Boot | Abschnitt 6 |
| Gerät startet, aber Benutzer kann sich nicht anmelden | **Nicht** RB-025, eher Identitäts-/Anmeldefall | Bestehende Anmelde-Runbooks |

## 2. Sicherheit und Prüfgrenzen (L1/L2)

- [ ] Keine elektrischen Arbeiten an offener PSU, keine improvisierten Adapter oder beschädigten Kabel.
- [ ] Keine wiederholten Power-Cycles während möglichem BIOS-Flash, Windows-Update, Verschlüsselungs- oder Datenträgerreparaturvorgang.
- [ ] Keine Gehäuseöffnung, RAM-/SSD-Ausbau, BIOS-Reset, TPM-/Secure-Boot-Umschaltung oder Firmware-Update ohne Zuständigkeit und dokumentierte Freigabe.
- [ ] **BitLocker-Recovery-Key nur im autorisierten Geheimnis-/Recovery-Prozess** beschaffen; nicht ins Ticket kopieren. Vor schreibendem Recovery: Sicherungsstatus, Dateneigentümer und Freigabe klären.
- [ ] Bei diagnostischen Ersatzteilen Modell, Spezifikationen, Seriennummer/Inventar, Zeitpunkt und Rückbau festhalten.

**Abbruchbedingung:** Unbekannte oder riskante Situation → sichere Beobachtungen dokumentieren und an L2/Security/Hardware eskalieren, nicht „noch etwas ausprobieren“.

## 3. Pfad A – Keine Reaktion / No Power (L1)

1. [ ] Äußere Schäden/Gefahren ausschließen. **Steckdose, Netzleiste und Geräteschalter** prüfen, ohne elektrische Messarbeiten.
2. [ ] Originalnetzteil/Netzkabel und Anschlüsse auf festen Sitz und offensichtliche Schäden prüfen. Kein Universalladegerät auf Verdacht.
3. [ ] Nur **freigegebenes**, kompatibles Vergleichsnetzteil bzw. andere belegbar funktionierende Stromquelle einsetzen; bei USB-C-Ladegeräten Unterstützung und Leistung beachten.
4. [ ] Notebook: Ladeanzeige, Akkustatus und Herstellerhinweise zum Laden beachten. Nicht entnehmbaren Akku nicht öffnen.
5. [ ] Eine definierte Startprobe protokollieren: Reaktion, LED, Geräusch, Bildschirm – Zeitpunkt.
6. [ ] **Kein Start** trotz sicherer Versorgung oder Hersteller-Hardwarehinweis → an L2/Hardware mit Messwerten/Beobachtungen übergeben.

**Nicht:** pauschal Power-Reset am unbekannten Modell, keine manipulativen Eingriffe in das Netzteil. Ein OEM-spezifischer Entlade-Reset ist nur bei dokumentiertem Modell und Freigabe zu bewerten.

## 4. Pfad B – Stromanzeichen, aber kein POST / Verdacht Hardware (L1 → L2)

1. [ ] LED-/Beep-Codes **genau** notieren: Anzahl, Farbe, Rhythmus und Wiederholung.
2. [ ] Exaktes OEM-Modell und zugehöriges Diagnosehandbuch ermitteln; **kein Universalcode** für HP, Dell, Lenovo usw.
3. [ ] Externe Geräte nach Gefahrenprüfung und Freigabe einzeln entfernen; anschließend genau eine Startprobe durchführen. Datenträger nicht während Schreibvorgängen abziehen.
4. [ ] Sofern zugänglich und freigegeben, OEM-Prebootdiagnose ausführen. Beispiel Dell: ePSA/SupportAssist Pre-boot (Startweg modellabhängig). **Fehlercode und Validierungsnummer** dokumentieren, keine vermutete Reparatur durchführen.
5. [ ] POST-Fehler oder unklarer schwarzer Bildschirm trotz Gegenproben → L2/Hersteller, Gehäuse und Firmware unangetastet lassen.

**Fachhinweis:** Stehenbleiben am Herstellerlogo kann **in der Firmwareinitialisierung oder am Boot-Übergang** liegen; nicht automatisch Windows als Ursache annehmen.

## 5. Pfad C – No Video sicher gegen No POST abgrenzen (L1)

1. [ ] Prüfen, ob der Monitor **eigenes Menü (OSD)** anzeigt; dessen Strom und Eingangsquelle kontrollieren.
2. [ ] Signalweg mit bekannt gutem, zulässigem Kabel und ggf. direkter Verbindung prüfen, ohne Dock/KVM/Adapter.
3. [ ] Bei Notebook internen Bildschirm gegen externen vergleichen; bei Desktop anderes bekannt intaktes Display verwenden.
4. [ ] Verlässliche Hinweise auf laufendes Windows (z. B. Nutzeranmeldung auf internem Bildschirm) dokumentieren. Nur unter gültiger Berechtigung Netzwerk-/Remote-Erreichbarkeit prüfen.
5. [ ] Wenn nur externer Bildschirm versagt → **RB-022/RB-023**; wenn kein Bild, aber Blink-/Beep-Codes vorhanden → **L2-Hardware/POST**.

**Nicht:** Der Satz „Lüfter läuft, also ist Windows gestartet“ ist falsch.

## 6. Pfad D – Windows erreicht den Desktop nicht / No Boot (L1-Aufnahme, L2-Recovery)

1. [ ] **Wörtliche Fehlermeldung** aufnehmen: „No bootable device“, „Automatic Repair“, Bluescreen/Stopcode, Bootmanager, BitLocker; ggf. datenschutzkonformes Foto.
2. [ ] Prüfen, ob OEM-UEFI die SSD und ggf. den Windows-Boot-Eintrag **lesend** anzeigt. SSD fehlt oder Hardwaretest fehlerhaft: L2/Storage; **nicht initialisieren**.
3. [ ] **Vor jeder Reparatur:** Backup-Status und autorisierten BitLocker-Schlüsselzugang prüfen. Ist beides unklar, keine schreibenden Schritte.
4. [ ] Nach Freigabe: Microsoft **WinRE → Problembehandlung → Erweiterte Optionen → Starthilfe** als geeignete Standardoption prüfen. Starthilfe **verändert** das System; sie ist keine reine Diagnose.
5. [ ] Resultat dokumentieren. Bei anhaltendem Fehler an **RB-026** (Windows startet nicht korrekt) bzw. Endpoint/L2 übergeben.

**Nicht ausführen ohne spezifisches Recovery-Verfahren:** `diskpart clean`, `format`, `bcdedit`-Änderungen, `bootrec`-Befehlsserien, `chkdsk /f` oder Reset/Neuinstallation. Erst Datenrettungs-/Backup-Priorität klären.

## 7. Lesende Windows-/PowerShell-Diagnose – **nur wenn Windows läuft** (L1/L2)

Diese Kommandos dienen der nachträglichen **Beweissicherung** auf wieder gestarteten oder autorisiert zugänglichen Geräten. **Bei No Power oder No POST nicht ausführbar.**

```powershell
# Hersteller und Modell für den OEM-Service bestimmen
Get-CimInstance Win32_ComputerSystem |
    Select-Object Manufacturer, Model, Name

# Firmwarestand nur auslesen, niemals hierüber automatisch aktualisieren
Get-CimInstance Win32_BIOS |
    Select-Object SMBIOSBIOSVersion, ReleaseDate

# Datenträgerinventar und gemeldeten Betriebsstatus auslesen
Get-Disk |
    Select-Object Number, FriendlyName, OperationalStatus, HealthStatus, Size

# Hinweise auf unerwarteten Shutdown – KEINE automatische Ursachenfeststellung
Get-WinEvent -FilterHashtable @{
    LogName = 'System'; Id = 41,6008; StartTime = (Get-Date).AddDays(-7)
} -ErrorAction SilentlyContinue |
    Select-Object -First 15 TimeCreated, Id, ProviderName, Message

# Status der Wiederherstellungsumgebung auf gestartetem Windows anzeigen
reagentc /info
```

**Interpretation:** Power-Event 41/6008 = möglicher Hinweis auf vorherigen ungeplanten Shutdown, **nicht** auf ein bestimmtes defektes Bauteil. „Healthy“ bei `Get-Disk` ist kein vollwertiger SSD-Funktionstest. Historische Gerätedaten aus Inventar/MDM dürfen nicht als **live bestätigter** Zustand ausgegeben werden.

## 8. Maßnahme, Kontrolle, Rückfall und Datenfreigabe

- [ ] **Eindeutigen Befund** formulieren („Netzleiste ohne Spannung“, „Monitor-Eingang falsch“, „OEM-POST-Fehlercode X“, „SSD im UEFI nicht erkannt“, ...).
- [ ] **Nur passende, freigegebene** Maßnahme durchführen; vorherige Konfiguration notieren.
- [ ] Gerät mindestens kontrolliert booten, erforderlichenfalls zweiter erfolgreicher Start nach Abstimmung.
- [ ] Windows-Login prüfen; Bildschirm, Eingabegeräte, ggf. Netzwerk und die tatsächlich benötigte Arbeitsanwendung testen.
- [ ] Falls System offen war/Hardware ersetzt wurde: Funktion und Inventar-/Garantieänderungen nach Vorgabe dokumentieren.
- [ ] Benutzer bestätigen lassen, ob das ursprüngliche Problem behoben ist; Ticket erst nach nachvollziehbarem Abschluss schließen.

**Rollback:** Nach jedem A/B-Test Ausgangsverkabelung und Betriebskonfiguration dokumentiert wiederherstellen. Ein geplanter Recovery-Eingriff braucht eine eigene Rückfall-/Backup-Strategie und zuständige Person.

## 9. Eskalation und Ticketdokumentation

**Sofort L2/Hardware/Security:** Schaden/Überhitzung; Stromversorgung trotz Vergleich erfolglos; wiederholter POST-Code; SSD fehlt/fehlerhaft; unbekannter BitLocker-Key; wichtige ungesicherte Daten; mehrfach gescheiterte Starthilfe; Vorgaben/Autorisierung fehlen.

**Übergabecheckliste:**

- [ ] Wer, wo, wann, Priorität, Auswirkungen, lokaler Datenbedarf.
- [ ] Hersteller, Modell, Serien-/Inventarnummer (gemäß Ticketvorgabe).
- [ ] **Fehlerklasse mit Beobachtung**; bei unsicherem No POST/No Video Unsicherheit ausdrücklich notieren.
- [ ] LEDs, Blink- und Piepmuster, OEM-Diagnosecodes, vollständige Fehlermeldung.
- [ ] Steckdose, Netzteil, Kabel, Dock, Monitor, Peripherie: Welche Vergleichstests mit welchem Ergebnis?
- [ ] Recovery/BitLocker: **nur Status und autorisierte Stelle**, keine Schlüssel im Ticket.
- [ ] Letzte Änderung, Backup-Status, Maßnahmen und Ausgangskonfiguration.
- [ ] Nächster zuständiger Bearbeiter und konkrete offene Prüf-Hypothese.

### Kopierbarer Ticketkommentar (fiktives Beispiel)

> **Symptom:** Notebook startet am Arbeitsplatz nicht; Power-Taste ohne Reaktion, Lade-LED aus. **Prüfung:** Äußere Beschädigung ausgeschlossen. Notebook über Dock angeschlossen; mit freigegebenem Originalnetzteil direkt am Gerät erscheint die Lade-LED, Windows startet. **Eingrenzung:** Fehler liegt wahrscheinlich im Dock-/Versorgungsweg; konkrete Komponente noch nicht belegt. **Maßnahme:** Übergangsweise Direktnetzteil, Nutzerzugriff und Windows-Anmeldung geprüft. **Weiteres Vorgehen:** Dock-Netzteil und Hostkabel an L2/Hardware übergeben. Kein Firmware-/BIOS-/Recovery-Eingriff.

## 10. Lernkontrolle, offizielle Quellen und Transparenz

**Vorlagenfreie Selbstkontrolle:**

1. Welche vier Fehlerklassen unterscheiden wir, und woran erkennst du sie?
2. Warum darfst du bei einem schwarzen Bildschirm nicht sofort Windows neu installieren?
3. Was ist die erste sichere Trennung zwischen „kein Strom“ und „kein Bild“?
4. Was würdest du bei einem Hersteller-Blinkcode dokumentieren und **wo** nachschlagen?
5. Welche Informationen müssen vor WinRE-/Starthilfe-Eingriffen geklärt sein?
6. Welche minimalen Angaben braucht L2, um ohne Neustart der Fehlersuche fortfahren zu können?

**Herstellerquellen (recherchiert am 22.11.2026):**

- Dell: Klassifikation No Power, No POST, No Boot, No Video: https://www.dell.com/support/kbdoc/en-us/000125609/resolve-no-power-no-post-no-boot-or-no-video-issues-with-your-dell-computer
- Dell: Stromversorgungsprobleme: https://www.dell.com/support/contents/en-ed/article/product-support/self-support-knowledgebase/fix-common-issues/no-power
- HP: Startprobleme und Diagnose: https://support.hp.com/ch-de/document/ish_4120821-4027713-16
- Microsoft Support: Windows-Wiederherstellungsumgebung: https://support.microsoft.com/de-de/windows/experience/backup-recovery/windows-recovery-environment
- Microsoft Support: Starthilfe: https://support.microsoft.com/de-de/windows/experience/startup-boot/startup-repair
- Microsoft Learn: Windows-Startphasen: https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/windows-boot-issues-troubleshooting
- Microsoft Learn: BitLocker Recovery: https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview

**Transparenz:** Dies ist ein recherchiertes **Arbeitsmuster**, nicht das Protokoll einer tatsächlich abgeschlossenen Störungsbehebung. Die Diagnosezweige und Muster-Ticketkommentare wurden **nicht praktisch getestet**. OEM-Anleitungen haben bei modellbezogenen Schritten Vorrang; die betrieblichen Sicherheits- und Freigabeprozesse gelten immer. Grafik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.
