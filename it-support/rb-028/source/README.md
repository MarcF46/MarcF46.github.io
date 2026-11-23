# RB-028 – Microsoft-Office-Anwendung startet nicht (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Recherche:** 22.11.2026  
**Fachstatus:** Anhand offizieller Microsoft-Dokumentation recherchiert; **praktische Validierung ausstehend**.

## Komplettpaket: sechs Dateien

```text
RB-028_Office-Anwendung-startet-nicht/
├── RB-028_Lernartikel.md
├── RB-028_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb028_henne_ei_office_start.png
    ├── rb028_diagnosebaum.svg
    └── rb028_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-028_Lernartikel.md` | 15 Kapitel: Office-Startkomponenten, Fehlerbilder, `/safe`, Add-in-/Profil-/Datei-/Lizenz-Abgrenzung, Office-Reparatur, lesende Diagnose, zwei fiktive Fälle, Active Recall |
| `RB-028_Praxis-Runbook.md` | Zehn Abschnitte: L1-Aufnahme, Sicherheits-Gate, Testmatrix, Safe-Mode-Diagnose, L2-Eskalation, Prüfkriterien und fiktiver Ticketkommentar |
| `assets/rb028_henne_ei_office_start.png` | Einzige Henne-und-Ei-Infografik: professioneller Stil, Henne analysierend, Ei als kritisch abwägender Kollege |
| `assets/rb028_diagnosebaum.svg` | Technischer Entscheidungsbaum für Datei-, Lizenz-, Startkomponenten- und Installationspfad |
| `assets/rb028_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Browser oder Website |
| `README.md` | Paketstruktur, Lern- und Validierungsablauf, Sicherheit, Quellen und Publikation |

**Hinweis:** Keine zusätzliche Bildersammlung und keine Änderungen an der veröffentlichten Website.

## Kerngedanke

> **Normalstart gegen Office Safe Mode vergleichen – nicht sofort Office neu installieren.** Das Verhalten von Word, Excel und PowerPoint im Safe Mode grenzt den Startpfad ein, identifiziert aber noch keine einzelne Ursache.

| Symptom | Einstieg |
|---|---|
| Office-App startet nicht, `/safe` klappt | Add-ins, Vorlagen und benutzerspezifische Startressourcen prüfen |
| Auch `/safe` klappt nicht | Eventlog, Installation, gemeinsame Komponenten, Windows-/Office-Änderungen und genehmigte Reparatur |
| App öffnet, nur bestimmte Datei nicht | Dokumenttyp, Speicherort, Zugriffsrechte, Dateiinhalte prüfen |
| App startet mit Aktivierungsfehler | Lizenz-/Konto-/RB-029-Pfad, kein automatischer Crash-Befund |
| Nur Outlook betroffen | RB-019 / Outlook-spezifisches Verfahren |

## Empfohlener Lernablauf

1. **Vorwissen aktivieren:** Formuliere ohne Hilfe fünf mögliche Fehlerursachen und entscheide, welche durch einen Safe-Mode-Test geprüft werden können.
2. **Artikel durcharbeiten:** Vor allem die Unterschiede zwischen Office Safe Mode, Startvorlagen und Installation erklären.
3. **Runbook simulieren:** Einen der fiktiven Fälle anhand der Entscheidungsmatrix selbstständig bearbeiten; erst dann mit Runbook vergleichen.
4. **Freigegebenes Lab:** An einer eigenen/Test-Office-Installation die drei Safe-Mode-Befehle und die lesenden Eventlog-Abfragen überprüfen.
5. **Praktisch validieren:** Nur tatsächlich ausgeführte Schritte dokumentieren und gegen den originalen Ausgangszustand vergleichen; Störungen nicht unkontrolliert erzeugen.
6. **Active Recall:** Nach ungefähr 7 und 21 Tagen einen ungekannten Office-Startfehler ohne Lösungshinweise eingrenzen.

## Sicherheits- und Freigaberegeln

- Änderungen an zentralen Office-/Add-in-Richtlinien, Office-Bereitstellung, Reparaturen oder Benutzerprofilen benötigen Zuständigkeit und Freigabe.
- Keine laufenden Office-Prozesse ohne Prüfung ungespeicherter Dokumente beenden.
- Vorlagen/`Normal.dotm`, Add-in-Konfiguration, Excel-XLSTART-Dateien und Registry nicht ungesichert löschen.
- Office-Reparatur kann die **gesamte Suite** betreffen. Vor Onlinereparatur Netz, Produkttyp, Bereitstellungsprozess und ggf. erneute Anmeldung berücksichtigen.
- Keine Schutzansicht, Makro- oder Endpoint-Security-Einstellungen zum Testen auf Verdacht deaktivieren.
- Protokolle und Screenshots dürfen sensible Datei-/Kontoinformationen enthalten; nicht in ungeschützte Tickets kopieren.
- Alle Musterfälle und Muster-Ticketkommentare sind **fiktiv**; keine Tests oder Reparaturen als real durchgeführt ausgeben.

## Für die spätere Website-Veröffentlichung

- Inhalte und `assets/`-Verzeichnis zusammen übertragen; die relativen Markdown-Bildpfade beibehalten.
- In der bestehenden Ticketliste unter **RB-028 – Microsoft-Office-Anwendung startet nicht (L1/L2)** einsortieren.
- Existierende Website-Navigation/Layout beibehalten; **keine** unmittelbare GitHub-Änderung durch die ZIP-Erstellung.
- Status offen und ehrlich ausweisen: **Recherchiert und dokumentiert; vollständige praktische Validierung noch nicht belegt.**
- Bildnachweis: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“**.

## Quellen – offizielle Microsoft-Dokumentation (geprüft 22.11.2026)

1. https://support.microsoft.com/de-de/office/lifecycle/open-office-apps-in-safe-mode-on-a-windows-pc
2. https://support.microsoft.com/de-de/office/lifecycle/i-get-a-stopped-working-error-when-i-start-office-applications-on-my-pc
3. https://support.microsoft.com/de-de/office/lifecycle/repair-an-office-application
4. https://support.microsoft.com/de-de/excel/excel-not-responding-hangs-freezes-or-stops-working
5. https://support.microsoft.com/de-de/word/how-to-troubleshoot-problems-that-occur-when-you-start-or-use-word
6. https://support.microsoft.com/de-de/word/change-the-normal-template-normal-dotm
7. https://support.microsoft.com/de-de/microsoft-365-activation-licensing/office-install/unlicensed-product-and-activation-errors-in-office
8. https://support.microsoft.com/de-de/office/lifecycle/error-0xc0000142-when-you-start-an-office-application
9. https://support.microsoft.com/de-de/support/known-issues/fixes-or-workarounds-for-recent-office-issues
10. https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior

**Recherchebeleg vs. Validierung:** Microsoft-Quellen stützen konkrete Befehle/Verfahren; der strukturierte Diagnosepfad ist eine eigens formulierte Lern- und Arbeitsvorlage. Praktische Testergebnisse wurden nicht vorgetäuscht.
