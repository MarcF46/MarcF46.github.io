# RB-025 – Computer startet nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Support-Level:** L1/L2  
**Fachlicher Status:** Herstellerrecherche und Dokumentation abgeschlossen; **die beschriebenen Lösungen sind noch nicht praktisch validiert**.

## Inhalt des Komplettpakets

```text
RB-025_Computer-startet-nicht/
├── RB-025_Lernartikel.md
├── RB-025_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb025_henne_ei_startprobleme.png
    ├── rb025_diagnosebaum.svg
    └── rb025_diagnosebaum_preview.png
```

| Datei | Inhalt und Zweck |
|---|---|
| `RB-025_Lernartikel.md` | **15 Kapitel**: No Power / No POST / No Video / No Boot, Diagnose- und Sicherheitspfade, nachvollziehbare A/B-Tests, lesende PowerShell-Prüfungen, **2 fiktive Praxisfälle**, Lernfragen und Quellen. |
| `RB-025_Praxis-Runbook.md` | **10 Abschnitte** für ein reales L1-/L2-Ticket: Erfassung, Risikogrenzen, vier Diagnosepfade, Nachkontrolle, Eskalationscheckliste und Beispiel-Ticketkommentar. |
| `assets/rb025_henne_ei_startprobleme.png` | Eigenständige **Henne-und-Ei-Comic-Infografik** im Design der Ticketreihe, zentrale Voraussetzungen des PC-Starts. |
| `assets/rb025_diagnosebaum.svg` | Technischer, skalierbarer Entscheidungsbaum mit Startphase, separatem Videozweig, Stop-Kriterien und WinRE-Schutzbedingungen. |
| `assets/rb025_diagnosebaum_preview.png` | Vorschau des SVG als PNG für die spätere Website oder eine Dokumentation. |
| `README.md` | Struktur, Verwendungsbedingungen, Quellen-/Qualitätshinweise. |

**Das Paket enthält sechs Dateien**, nicht mehr. Eine zusätzliche Bildergalerie oder Suchbilder werden nicht benötigt.

## Reihenfolge für die spätere praktische Arbeit

1. **Lernartikel** durcharbeiten; ohne Vorlage die vier Fehlerklassen erklären.
2. **Praxis-Runbook** an einem echten, autorisierten oder im sicheren Labor simulierten Fall anwenden.
3. **Diagnosebaum** als Gedächtnisstütze verwenden; ihn nicht als automatischen Beweis für eine Ursache missverstehen.
4. Pro Test nur eine Variable ändern; **Beobachtung → Hypothese → Test → Ergebnis → Entscheidung** dokumentieren.
5. Technische Schritte nach **Hersteller-Modell**, interner IT-Richtlinie und dem Daten-/BitLocker-Prozess auswählen.
6. Erst nach dokumentierter und eigenständig nachprüfbarer Erfolgskontrolle als **praktisch validiert** kennzeichnen.

## Website-Veröffentlichung (später)

- Dieses Paket ist **noch nicht** auf der GitHub-Pages-Website veröffentlicht.
- Markdown und zugehörigen `assets/`-Ordner gemeinsam übernehmen; relative Pfade müssen erhalten bleiben.
- `rb025_henne_ei_startprobleme.png` als Projekt-Infografik; `rb025_diagnosebaum.svg` als technischer Diagnosebaum einbinden. PNG-Vorschau optional statt SVG, nicht als zusätzliches fremdes Motiv.
- Bis zur eigenen praktischen Erprobung ausdrücklich als **recherchierte/theoretische Fallanalyse** bezeichnen.
- KI-Visualisierung kennzeichnen: „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.
- Tiefe Windows-Bootreparatur/Recovery separat in **RB-026 – Windows startet nicht korrekt** bearbeiten.

## Technische Sicherheitsgrenze

**Nicht**: Netzteil öffnen; Flüssigkeits-/Hitzeschaden weiter betreiben; BIOS/UEFI/TPM/Secure-Boot ohne Freigabe verändern; Datenträger initialisieren; Windows auf Verdacht zurücksetzen oder neu installieren; BitLocker-Recovery-Schlüssel im Ticket hinterlegen.

**Wichtig:** Ein PC kann erfolgreich starten und trotzdem **kein Bild** anzeigen. Umgekehrt können Lüfter drehen, obwohl der Firmware-Selbsttest nicht abgeschlossen ist. Die exakte Startphase ist daher stets zu prüfen.

## Offizielle Referenzen (Recherche 22.11.2026)

- Dell, „Resolve No Power, No POST, No Boot or No Video Issues“: https://www.dell.com/support/kbdoc/en-us/000125609/resolve-no-power-no-post-no-boot-or-no-video-issues-with-your-dell-computer
- Dell, Stromversorgungsprobleme: https://www.dell.com/support/contents/en-ed/article/product-support/self-support-knowledgebase/fix-common-issues/no-power
- HP, PC startet nicht: https://support.hp.com/ch-de/document/ish_4120821-4027713-16
- Microsoft Support, Windows-Wiederherstellungsumgebung: https://support.microsoft.com/de-de/windows/experience/backup-recovery/windows-recovery-environment
- Microsoft Support, Starthilfe: https://support.microsoft.com/de-de/windows/experience/startup-boot/startup-repair
- Microsoft Learn, Windows-Startprobleme: https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/windows-boot-issues-troubleshooting
- Microsoft Learn, BitLocker-Wiederherstellung: https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview

**Transparenz:** Herstellerinformationen wurden mit einem eigenen L1-/L2-Diagnoseschema didaktisch aufbereitet. Weder die Musterfälle noch die PowerShell-Befehle wurden in einer realen Störungsumgebung ausgeführt. Keine tatsächliche Lösung oder Wirksamkeit eines Eingriffs wird behauptet.
