# RB-027 – Windows Update schlägt fehl (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Recherche:** 22.11.2026  
**Fachstatus:** Offizielle Microsoft-Dokumentation ausgewertet; als Lern- und Diagnosekonzept erstellt. **Noch nicht praktisch validiert.**

## Komplettpaket: Dateistruktur

```text
RB-027_Windows-Update-schlaegt-fehl/
├── RB-027_Lernartikel.md
├── RB-027_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb027_henne_ei_windows_update.png
    ├── rb027_diagnosebaum.svg
    └── rb027_diagnosebaum_preview.png
```

| Datei | Verwendung |
|---|---|
| `RB-027_Lernartikel.md` | 15 Kapitel: Update-Abhängigkeitskette, Fehlersymptome, Update-Typen, Protokolle, sichere PowerShell-Prüfungen, Fehlercodes, Einzelplatz- und Unternehmensdiagnose, zwei fiktive Praxisfälle und Active Recall |
| `RB-027_Praxis-Runbook.md` | Zehn Abschnitte mit L1-Erstdiagnose, L2-Entscheidungspfaden, Sicherheits-Gate, prüfbaren Erfolgskriterien und kopierfertigem Muster-Ticketkommentar |
| `assets/rb027_henne_ei_windows_update.png` | Eigenständige Henne-und-Ei-Comic-Infografik: Fehlerphase und korrektes Troubleshooting (professionellere Gestaltung der ab RB-026 überarbeiteten Reihe) |
| `assets/rb027_diagnosebaum.svg` | Skalierbarer technischer Diagnose-Entscheidungsbaum mit den Wegen Suche, Download, Installation und Neustart/Rollback |
| `assets/rb027_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Browser/Website |
| `README.md` | Paketaufbau, Lernablauf, Sicherheitsregeln, Quellen und Hinweise zur Publikation |

**Umfang: Genau sechs Dateien.** Es wurde keine zusätzliche Bildersammlung erstellt. Die Website ist bei der Paketerstellung unverändert geblieben.

## Arbeitsprinzip für diesen Fall

> **Erkennen statt raten:** **KB-/Update-Typ + Fehlercode + Phase + Log-Befund** liefern die Arbeitsgrundlage. Eine einzelne Fehlermeldung rechtfertigt keinen pauschalen Windows-Update-Reset.

Die Diagnose ist in vier Phasen gegliedert:

1. **Suche:** Richtige Quelle? Update angeboten und freigegeben?
2. **Download:** Updatequelle erreichbar? Proxy/Netz/Speicher/Transfer plausibel?
3. **Installation:** CBS/Servicing, Komponentenstore oder Anwendbarkeit fehlerhaft?
4. **Neustart/Abschluss:** Installation noch ausstehend? Rollback beim Featureupdate?

**Wichtiges Zusatzwissen:** Für WSUS-/Intune-/Configuration-Manager-Geräte müssen zentrale Richtlinien und Freigaben mitgedacht werden. Ein erfolgreich durchgeführter Scan beweist keine erfolgreiche Bereitstellung.

## Empfohlener Lern- und Validierungsablauf

1. **Vorwissen aktivieren:** Die vier Updatephasen ohne Vorlage erklären.
2. **Artikel durchgehen:** Funktionsweise und zugehörige Logs eigenständig zuordnen; problematische Reparatur-„Allheilmittel“ erkennen.
3. **Runbook anwenden:** Mit fiktivem Ticket nur die zulässigen L1-Abfragen planen; danach L2-Analyse ausarbeiten.
4. **Praktisch validieren:** In freigegebener Laborumgebung zunächst **lesende** Zustandsabfragen und Eventlog-Analyse testen; einen Defekt nicht unkontrolliert künstlich erzeugen.
5. **Erfolg nachweisen:** Falls ein genehmigter Testfehler existiert, KB-Status, Neustart und Arbeitsfunktion nachweisen; nur tatsächlich gemessene Resultate als validiert kennzeichnen.
6. **Zeitversetzt prüfen:** Nach etwa 7/21 Tagen mit neuen Diagnosefällen und ggf. Anki-Karten (Wissen, Verständnis, Diagnose) wiederholen.

## Sicherheits-/Freigaberegeln

- Keine Dienste, `SoftwareDistribution`, `catroot2`, BITS-Zustände oder Update-Richtlinien pauschal zurücksetzen, bevor ein belegter Fehlerpfad vorliegt.
- Keine unautorisierten Änderungen an WSUS, Intune, Gruppenrichtlinien, Proxy, Firewall oder Endpoint-Security.
- Keine Reparaturkommandos wie `DISM /RestoreHealth` ohne geklärte Berechtigung, Backup, Sicherheitsfolgen und notwendige Reparaturquelle; `sfc /scannow` kann ebenfalls Änderungen vornehmen.
- Keine erzwungenen Neustarts während einer laufenden Installation oder bei unklarer Daten-/Recovery-Lage.
- BitLocker-Schlüssel niemals in Tickets, Screenshots oder ungeschützten Protokollablagen hinterlegen.
- Alle in Artikel und Runbook enthaltenen Diagnosebeispiele und Ticketberichte sind **fiktiv**. Keine Test- oder Reparaturergebnisse dürfen als tatsächlich durchgeführt ausgegeben werden.
- Prüfen, ob die Windows-11-Option **„Probleme mithilfe von Windows Update beheben“** bei verwalteten Geräten überhaupt angeboten wird; sie ist kein Ersatz für die Fehleranalyse.

## Integration in die bestehende GitHub-Pages-Website

- Lernartikel und Runbook sowie den vollständigen `assets/`-Ordner gemeinsam übernehmen; **relative Bildpfade beibehalten**.
- Vorhandenes Layout für „50 Tickets – 50 typische Supportfälle“ verwenden und RB-027 fachlich unter **„Windows Update schlägt fehl (L1/L2)“** einsortieren.
- Status bis zur eigenen Laborprüfung als *recherchiert/theoretisch nachvollzogen, praktische Validierung ausstehend* ausweisen.
- Transparente Grafik-Kennzeichnung: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“**.
- **Keine** Änderungen am GitHub-Repository oder an der veröffentlichten Website durch dieses Paket.

## Quellen – offizielle Microsoft-Dokumentation, geprüft 22.11.2026

1. https://support.microsoft.com/de-de/windows/deployment/updates-lifecycle/troubleshoot-problems-updating-windows
2. https://support.microsoft.com/de-de/windows/experience/windows-update-troubleshooter
3. https://learn.microsoft.com/de-de/windows/deployment/update/how-windows-update-works
4. https://learn.microsoft.com/de-de/windows/deployment/update/windows-update-logs
5. https://learn.microsoft.com/de-de/powershell/module/windowsupdate/get-windowsupdatelog
6. https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting
7. https://learn.microsoft.com/de-de/troubleshoot/windows-server/installing-updates-features-roles/fix-windows-update-errors
8. https://learn.microsoft.com/de-de/windows-hardware/manufacture/desktop/repair-a-windows-image?view=windows-11
9. https://learn.microsoft.com/de-de/windows/deployment/update/wufb-wsus
10. https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-protection/troubleshoot-update-rings
11. https://learn.microsoft.com/de-de/windows/deployment/upgrade/setupdiag
12. https://learn.microsoft.com/de-de/windows/deployment/upgrade/log-files
13. https://support.microsoft.com/de-de/windows/deployment/install-upgrade/get-help-with-windows-upgrade-and-installation-errors
14. https://support.microsoft.com/en-gb/windows/deployment/install-upgrade/fix-issues-by-reinstalling-the-current-version-of-windows

**Transparenz zur Erstellung:** Der Text und das Diagramm sind speziell für dieses Lernprojekt redaktionell zusammengestellt. Die Henne-und-Ei-Illustration ist KI-generiert. Trotz Herstellerrecherche können Diagnoseschritte vom konkreten Windows-Build, Gerätehersteller und den Betriebsrichtlinien abhängen; sie müssen in der vorgesehenen Testumgebung überprüft werden.
