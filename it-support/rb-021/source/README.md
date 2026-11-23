# RB-021 – Teams-Kamera oder Mikrofon funktioniert nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Support-Level:** L1/L2 · **Status:** anhand offizieller Microsoft-Dokumentation recherchiert; praktische Validierung ausstehend.

## Inhalt des Komplettpakets

```text
RB-021_Teams-Kamera-Mikrofon/
├── RB-021_Lernartikel.md
├── RB-021_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb021_henne_ei_teams_kamera_mikrofon.png
    ├── rb021_diagnosebaum.svg
    └── rb021_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-021_Lernartikel.md` | Fachartikel mit 15 Kapiteln, Grundlagen, typischen Fehlern, Tests, lesenden Befehlen, Quellen und Lernaufgaben |
| `RB-021_Praxis-Runbook.md` | Kompakter Arbeitsablauf für Erstannahme, Diagnose, kontrollierte Maßnahmen, Dokumentation und Eskalation |
| `assets/rb021_henne_ei_teams_kamera_mikrofon.png` | Henne-Ei-Infografik im etablierten Projektstil |
| `assets/rb021_diagnosebaum.svg` | Technischer Entscheidungsbaum für die Website, verlustfrei skalierbar |
| `assets/rb021_diagnosebaum_preview.png` | PNG-Vorschau zum Diagnosebaum |

## Veröffentlichung auf GitHub Pages (später)

- Paket vollständig und einschließlich `assets/` übernehmen; die Markdown-Bildpfade sind relativ.
- Lernartikel als Detailseite und Praxis-Runbook als Schnellreferenz anbieten.
- Diagnosebaum bei Bedarf in eine horizontal scrollbare Grafikansicht einbetten.
- Querverweis zu **RB-015 – Microsoft Teams funktioniert nicht** auf den tatsächlichen Website-Pfad anpassen.
- Sicherheits- und Transparenzhinweise aus dem Artikel beibehalten.
- **Es wurde nichts automatisch an der Website veröffentlicht oder im Repository verändert.**

## Wichtige fachliche Regeln

1. Windows-Kamera-/Mikrofontest **vor** tiefen Teams-Eingriffen zur Fehlertrennung nutzen.
2. Kamera und Mikrofon separat testen; Hardwareerkennung ist kein End-to-End-Funktionstest.
3. Bei Teams Web die zusätzliche **Websiteberechtigung** berücksichtigen; der Teams-Testanruf ist dort nicht verfügbar.
4. PnP-/Treiber-/Berechtigungsänderungen nur mit Diagnosebeleg und entsprechender Unternehmensfreigabe.
5. VDI-/RDP-Probleme sowie verwaltete Sperren rechtzeitig an L2 eskalieren.

**Bildkennzeichnung:** Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Cartoon-Grafik ist kein Screenshot. **Ticketbeispiele sind fiktiv und wurden nicht in einer produktiven Umgebung durchgeführt.**
