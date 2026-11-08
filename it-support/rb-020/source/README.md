# RB-020 – E-Mail-Anhang lässt sich nicht öffnen

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 / 08.11.2026  
**Status:** Recherchiert; nicht praktisch im Unternehmensbetrieb validiert.

## Paketstruktur

- `RB-020_Lernartikel.md` – ausführlicher Anfängerartikel in 15 Kapiteln mit Quellen und Lernkontrolle
- `RB-020_Praxis-Runbook.md` – kurze Arbeitsanweisung für den L1-/L2-Support
- `assets/rb020_henne_ei_anhang.png` – farbige Henne-Ei-Infografik
- `assets/rb020_diagnosebaum.svg` – technischer Diagnose-Entscheidungsbaum, skalierbar
- `assets/rb020_diagnosebaum_preview.png` – PNG-Vorschau des Entscheidungsbaums
- `README.md` – diese Datei

## Website-Integration

Die Markdown-Dateien enthalten relative Bildverweise (`assets/...`). Bei der HTML-Konvertierung die Grafiken im jeweiligen Ticketordner belassen und den bestehenden Terminal-Codeblock-Stil verwenden. Beispiel-Tickets sind **fiktiv**; vor tatsächlicher Nutzung die Diagnosebefehle und Herstellerquellen gegen die Umgebung prüfen.

## Sicherheitsgrundsatz

Verdächtige Dateianhänge weder öffnen noch freigeben, Herkunftskennzeichen/geschützte Ansicht nicht blind entfernen; Quarantäne und Unternehmensrichtlinien sind Aufgabe freigegebener administrativer Verfahren.

## Abgrenzung

Verwandte Tickets: RB-006 Outlook sendet/empfängt nicht, RB-019 Outlook-Profil beschädigt, RB-013 Softwareinstallation, RB-014 Anwendungszugriff.
