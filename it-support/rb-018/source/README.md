# RB-018 – Netzwerkdrucker wird nicht gefunden

**Version:** 1.0 · **Stand:** 08.11.2026  
**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Fachstatus:** Auf Basis offizieller Microsoft-Dokumentation recherchiert; praktische Validierung ausstehend.

## Inhalt

```text
RB-018_Netzwerkdrucker-nicht-gefunden/
├── RB-018_Lernartikel.md
├── RB-018_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb018_henne_ei_netzwerkdrucker.png
    ├── rb018_diagnosebaum.svg
    └── rb018_diagnosebaum_preview.png
```

- **Lernartikel:** Erklärt GPO, Printserver, Windows-RPC, Treiber, Point and Print, Diagnosebefehle, Ursachen, Lösungen, Beispiele, Lernfragen und Quellen.
- **Praxis-Runbook:** Verdichtete Schritt-für-Schritt-Arbeitsanweisung für den Supportalltag.
- **Henne-Ei-Infografik:** Didaktische Illustration des Gesamtprozesses; kein Screenshot aus einer echten Umgebung.
- **Diagnosebaum (SVG + PNG):** Detaillierte Entscheidungswege als Vektorgrafik und Vorschau.

## Website-Integration

Die Markdown-Dateien referenzieren die Grafiken **relativ zum Unterverzeichnis `assets/`**. Verzeichnisstruktur beim Import möglichst beibehalten. Die CSS-/HTML-Darstellung übernimmt die Website; keine automatischen Änderungen an GitHub erfolgen mit diesem Paket.

## Wichtige fachliche Hinweise

- Ein erfolgreiches `Test-NetConnection PRINT01 -Port 135` beweist noch **keine vollständige Druckerverbindung**; RPC verwendet unter Umständen weitere dynamische Ports.
- Port 445 ist **kein universeller Test** für Printserververbindungen; Windows 11 nutzt seit 22H2 standardmäßig RPC über TCP.
- Point-and-Print-Sicherheitsregeln nicht umgehen; Treiberverwaltung nur nach Unternehmensrichtlinie.
- Vor Änderung auf gemeinsam genutzten Druckservern die Auswirkung auf andere Benutzer beachten.
- Alle Beispielnamen, Fehlerabläufe und Muster-Tickets sind fiktiv.

**Bildhinweis:** Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Grafik ist schematisch und ersetzt keine Herstellerdokumentation.
