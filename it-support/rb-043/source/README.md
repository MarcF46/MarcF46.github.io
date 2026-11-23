# RB-043 – Datenträger voll (L1/L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle · **Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Technisch recherchiert, dokumentiert, **nicht praktisch validiert**. Alle Beispieldaten sind **fiktiv**.

## Paketstruktur – genau sechs Dateien

| Datei | Zweck |
|---|---|
| `RB-043_Lernartikel.md` | Ausführliche 15-Kapitel-Lernunterlage mit Ursachen, lesender Windows-/PowerShell-Diagnose, zwei fiktiven Fällen und Active Recall |
| `RB-043_Praxis-Runbook.md` | 10-teilige L1-/L2-Checkliste mit Sicherheits- und Freigabeschranken |
| `assets/rb043_henne_ei_datentraeger_voll.png` | Henne-und-Ei-Infografik im professionelleren Stil der Reihe |
| `assets/rb043_diagnosebaum.svg` | Technischer Entscheidungsbaum als skalierbare Vektorgrafik |
| `assets/rb043_diagnosebaum_preview.png` | PNG-Vorschau für Website und Lernnotizen |
| `README.md` | Paketübersicht, Quellen und Lern-/Validierungshinweise |

## Fachliche Kernaussagen

1. **Ein volles Volume ist ein Symptom, keine Dateilöschfreigabe.** Zuerst Volume, Kapazität, Quota, Ort und Zeitpunkt nachweisen.
2. Speicherbelegung kann in Benutzerdateien, temporären Daten, Windows-Systemkomponenten, Schattenkopien, Cloud-Offlinedaten und Server-/VDI-/VM-Storage entstehen.
3. Dateilänge, Ordnergröße im Explorer und tatsächlich belegter Volume-Speicher sind nicht stets gleich (Hardlinks, Sparse, Kompression usw.).
4. **WinSxS, VSS, Backup-Repositories, VHDX und Profilordner niemals auf Verdacht löschen.** Sicherheitsfreigabe und Eigentümerklärung haben Vorrang.
5. `Get-Volume`, gezielte `Get-ChildItem`-Abfragen, `DISM /AnalyzeComponentStore` und `vssadmin list shadowstorage` dienen der **lesenden** Einordnung.
6. Abschluss nur mit Messung vorher/nachher, tatsächlichem Anwendungstest, Datenerhalt und dokumentierter Maßnahme.

## Vorbereitung der späteren Laborvalidierung

- **Isoliertes Testvolume/VHDX** verwenden, nicht das produktive Systemlaufwerk künstlich füllen. Testdateien ohne Wert anlegen, Ausgangswerte messen und kontrolliert ändern.
- Diagnose zunächst ohne Hilfe: Symptome → drei plausible Hypothesen → zwei sichere, lesende Tests → begründete Maßnahme.
- Optional *Windows-Einstellungen → System → Speicher* ansehen und mit `Get-Volume` vergleichen. Keine produktiven Daten löschen.
- Einen **simulierten Quota-/Netzfreigabefall** durchsprechen, um lokalen freien Speicher von Zugriffsquota zu trennen.
- Nach etwa 7 und 21 Tagen erneut ohne Vorlage prüfen (anderer Pfad, OneDrive, VDI, VSS).

## Quellen (offizielle Microsoft-Dokumentation)

- https://support.microsoft.com/de-de/windows/experience/storage-filemanagement/free-up-drive-space-in-windows
- https://support.microsoft.com/de-de/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense
- https://support.microsoft.com/de-de/windows/experience/storage-filemanagement/storage-settings-in-windows
- https://support.microsoft.com/de-de/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows
- https://learn.microsoft.com/de-de/windows-hardware/manufacture/desktop/clean-up-the-winsxs-folder?view=windows-11
- https://learn.microsoft.com/en-us/powershell/module/storage/get-volume?view=windowsserver2025-ps
- https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/vssadmin-list-shadowstorage
- https://learn.microsoft.com/en-us/troubleshoot/windows-server/backup-and-storage/troubleshoot-data-corruption-and-disk-errors
- https://learn.microsoft.com/en-us/troubleshoot/windows-server/backup-and-storage/troubleshoot-windows-server-storage-sense

## Website-Integration und Transparenz

Die Website `https://marcf46.github.io/` bleibt **unverändert**. Beim späteren Einbau die relativen Markdown-Bildpfade und das vorhandene Seitendesign übernehmen.

**KI-Kennzeichnung:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“

**Transparenzhinweis:** „Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung der beschriebenen Maßnahmen steht noch aus.“
