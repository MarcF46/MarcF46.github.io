# RB-024 – USB-Gerät, Maus oder Tastatur ausgefallen

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Support-Level:** L1; Übergabe an L2/Endpoint/Hardware nach den beschriebenen Kriterien  
**Status:** Technische Herstellerrecherche und Dokumentation abgeschlossen; **praktische Validierung steht aus**.

## Inhalt des Komplettpakets

```text
RB-024_USB-Maus-Tastatur-ausgefallen/
├── RB-024_Lernartikel.md
├── RB-024_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb024_henne_ei_usb_geraete.png
    ├── rb024_diagnosebaum.svg
    └── rb024_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-024_Lernartikel.md` | Ausführlicher, recherchierter Lernartikel mit **15 Kapiteln**: USB-/HID-Grundlagen, Fehlerhypothesen, Gegenproben, USB-Kabelgeräte, Receiver, Bluetooth, Gerätemanager/PowerShell, Sicherheitsregeln, fiktive Fälle und Active Recall |
| `RB-024_Praxis-Runbook.md` | **Zehn Abschnitte** als kompakte L1-Ticketarbeitsanweisung mit A/B-Testmatrix, getrennten Diagnosezweigen, Re-Test und Eskalation |
| `assets/rb024_henne_ei_usb_geraete.png` | Henne-und-Ei-Comic-Infografik passend zur Reihe RB-021 bis RB-023 |
| `assets/rb024_diagnosebaum.svg` | Skalierbarer, technischer Diagnose-Entscheidungsbaum für die spätere Website |
| `assets/rb024_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums |
| `README.md` | Dateierklärung, Hinweise zum Wiedereinbau in das Projekt und Status der Validierung |

## Einsatz- und Veröffentlichungshinweise

- ZIP entpacken und Verzeichnisse/Dateinamen **inklusive `assets/`** beibehalten; Markdown nutzt relative Bildlinks.
- Lernartikel für technische Zusammenhänge, Runbook für die spätere **echte** Supportticketbearbeitung. Unterschiedliche Ziele, keine unnötige Doppelablage weiterer Bilder.
- SVG auf GitHub Pages möglichst responsiv darstellen und bei schmalen Ansichten eine horizontale Scrollmöglichkeit anbieten. PNG ist die Fallback-Vorschau.
- **Reihenfolge:** Ticket 23 = Dockingstation funktioniert nicht; **Ticket 24 = USB-Gerät, Maus oder Tastatur ausgefallen**; Ticket 25 = Computer startet nicht.
- **Noch nicht veröffentlicht:** Dieses ZIP ändert weder die Website noch das GitHub-Repository.
- Quellenlinks wurden am 22.11.2026 recherchiert und sollten vor späterer Veröffentlichung erneut geprüft werden.

## Sicherheit und Transparenz

- Alle beispielhaften Tickets/Fallanalysen im Artikel sind **fiktiv** und nicht als real durchgeführte Laborvalidierung zu verstehen.
- **Speichergeräte:** Kein Abziehen während Schreib-/Kopiervorgängen; keine ungeprüfte Datenträgerinitialisierung, Formatierung oder Recovery.
- **Gefahr:** Bei Hitze, Überstrom oder beschädigtem Port nicht weiter testen.
- **Konfiguration:** Kein pauschales Deinstallieren von USB-Controllern oder Abschalten des USB Selective Suspend; Richtlinien und Device-Control nicht umgehen.
- PowerShell-Beispiele im Paket sind **lesend** und verändern keine Konfiguration; Befehle vor produktivem Einsatz in der jeweiligen Umgebung prüfen.
- Störung ist erst behoben, wenn Maus-/Tastatur-/Gerätefunktion tatsächlich getestet und bestätigt wurde, nicht allein anhand eines Geräte-Manager-Eintrags.
- **Bildnachweis:** Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Cartoon-Grafik und der Diagnosebaum sind didaktische Illustrationen, keine Fotos oder Screenshots realer Kundensysteme.

## Lernstandard und Qualitätsnachweis

1. **Vorwissen aktivieren:** Eigenständig erklären, weshalb ein leuchtendes Gerät nicht automatisch eine funktionierende Datenverbindung beweist.
2. **Diagnose üben:** Pro Übungsfall zunächst mindestens zwei Alternativhypothesen und einen trennenden A/B-Test formulieren.
3. **Eigene Praxis nachtragen:** Nach späteren Labortests tatsächlich durchgeführte Schritte, Hardware, Beobachtungen, Befunde und Validierungsresultate ergänzen; nicht mit der Recherche vermischen.
4. **Wissen abrufen:** Fragen in Kapitel 14 ohne Hilfsmittel lösen, bei Bedarf Wissens-, Verständnis- und Diagnosekarten in Anki übertragen.
5. **Spaced Repetition:** Nach etwa 7 und 21 Tagen ein neues USB-Fehlerbild unabhängig diagnostizieren.

**Nächster geplanter Fall:** RB-025 – Computer startet nicht (L1/L2).
