# RB-007 – Windows-PC oder Laptop ungewöhnlich langsam

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 | **Stand:** 08.11.2026 | **Status:** recherchiert, praktisch nicht validiert

## Inhalte

| Datei | Zweck |
|---|---|
| [RB-007_Lernartikel.md](RB-007_Lernartikel.md) | Ausführlicher, anfängerfreundlicher Lernartikel mit 15 Kapiteln, Begriffserklärungen, kommentierten PowerShell-Befehlen, Beispielticket und Quellen |
| [RB-007_Praxis-Runbook.md](RB-007_Praxis-Runbook.md) | Kompakte Checkliste für die praktische Ticketbearbeitung |
| [assets/rb007_henne_ei_performance.png](assets/rb007_henne_ei_performance.png) | Henne-Ei-Infografik zum Supportfall |
| [assets/rb007_diagnosebaum.svg](assets/rb007_diagnosebaum.svg) | Technischer Diagnose-Entscheidungsbaum als skalierbare Vektorgrafik |
| [assets/rb007_diagnosebaum_preview.png](assets/rb007_diagnosebaum_preview.png) | PNG-Vorschau des Diagnose-Entscheidungsbaums |

## Verwendung auf der GitHub-Website

- `RB-007_Lernartikel.md` ist die ausführliche inhaltliche Basis für die Webseite.
- `RB-007_Praxis-Runbook.md` ist die kurze Arbeitsanweisung; im Artikel darauf verlinken.
- Die beiden Grafiken in `assets/` relativ zum Markdown-Pfad belassen.
- Für eine saubere Darstellung ein Theme/Stylesheet der GitHub-Pages-Seite verwenden. Die Markdown-Vorschau von VS Code (`Strg + Umschalt + V`) ist lediglich eine Vorschau und nicht das endgültige Website-Layout.
- Es wird **keine praktische Durchführung** behauptet. Messergebnisse aus dem Beispiel sind fiktiv. Echte Tests später mit anonymisierten Vorher-/Nachher-Daten dokumentieren.

## Sicherheits- und Dokumentationshinweise

Die Befehle im Artikel dienen der **lesenden Diagnose**. Administrative Änderungen, Neustarts, Beenden von Prozessen und Eingriffe in Sicherheits-, Backup- oder Update-Dienste benötigen die jeweiligen organisatorischen Freigaben.

Die Infografik wurde eigens konzipiert und KI-gestützt erstellt: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“**. Kein Original-Screenshot einer Unternehmensumgebung.

## Technische Hauptreferenzen

- [Microsoft Support – PC-Leistung in Windows](https://support.microsoft.com/de-de/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows)
- [Microsoft Learn – Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-5.1)
- [Microsoft Learn – Leistungsmonitor](https://learn.microsoft.com/de-de/troubleshoot/windows-server/support-tools/troubleshoot-issues-performance-monitor)
- [Microsoft Learn – WPR](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/introduction-to-wpr)

Weitere Quellen stehen in beiden Markdown-Dokumenten.
