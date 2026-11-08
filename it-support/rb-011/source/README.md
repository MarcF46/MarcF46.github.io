# RB-011 – VPN-Verbindung schlägt fehl

**Paketversion:** 1.0 · **Stand:** 08.11.2026

## Inhalt

- `RB-011_Lernartikel.md` – ausführliches Grundlagen- und Diagnosedokument, 15 Kapitel, Microsoft-Quellen, kommentierte PowerShell-Befehle und fiktives Ticket.
- `RB-011_Praxis-Runbook.md` – kompakte L1-/L2-Checkliste.
- `assets/rb011_henne_ei_vpn.png` – einheitliche Henne-Ei-Infografik, KI-gestützt visualisiert.
- `assets/rb011_diagnosebaum.svg` – eigener technischer Diagnose-Entscheidungsbaum.
- `assets/rb011_diagnosebaum_preview.png` – Rastervorschau des SVG-Baums.

Die Bilder werden im Lernartikel mit relativen Pfaden unter `assets/` referenziert. Die beiden Dokumente können in Visual Studio Code mit **Strg + Umschalt + V** als Markdown-Vorschau gelesen werden.

## Wichtige fachliche Abgrenzung

Das beschriebene Windows-VPN-Management mit `Get-VpnConnection` gilt für **Windows-integrierte** VPN-Profile. Andere VPN-Clients brauchen gegebenenfalls Herstellertools. Die Beispieladressen sind fiktiv; Befehle wurden **nicht** in einer produktiven VPN-Umgebung getestet.

## Einsatz auf der Website

Den Lernartikel als ausführliche Detailseite, das Praxis-Runbook als separate Kurz-Anleitung und die beiden Grafiken als begleitende Visualisierung einbinden. Microsoft-Learn-Links im Artikel beibehalten, Quellenstand auf Wunsch bei Veröffentlichung neu prüfen. Keine fiktiven Testergebnisse als real ausgeben.
