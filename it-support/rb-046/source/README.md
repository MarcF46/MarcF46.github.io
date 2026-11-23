# RB-046 – Softwaredeployment schlägt fehl (L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 23.11.2026 · **Paketversion:** 1.0  
**Validierungsstatus:** Offizielle Microsoft-Quellen recherchiert und theoretisch nachvollzogen; **noch nicht praktisch validiert**. Alle Beispieldaten und Fallanalysen sind fiktiv.

## Paketstruktur – genau sechs Dateien

| Datei | Inhalt |
|---|---|
| `RB-046_Lernartikel.md` | 15 Kapitel: Intune-Win32-Deployment, Zuweisung, Check-in, Download, Installer, Detection, Exit-Codes, ConfigMgr-Abgrenzung, zwei fiktive Fälle, Active Recall |
| `RB-046_Praxis-Runbook.md` | Zehn Arbeitsabschnitte: L2-Ticketaufnahme, Sicherheitscheck, lesende Clientbefunde, Entscheidungsmatrix, Retest, Eskalation |
| `assets/rb046_henne_ei_softwaredeployment.png` | Professionelle Henne-und-Ei-Infografik zu den Deployment-Phasen |
| `assets/rb046_diagnosebaum.svg` | Skalierbarer Entscheidungsbaum mit unterschiedlichen Fehlerpfaden |
| `assets/rb046_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Lernunterlagen |
| `README.md` | Diese Datei, Quellen und Veröffentlichungsregeln |

## Kernaussagen

- **Zuweisung ≠ Download ≠ Installation ≠ erfolgreiche Erkennung ≠ funktionierende App.**
- Intune-Meldung `0x87D1041C` weist auf eine fehlgeschlagene **App-Erkennung nach Installation** hin; nicht automatisch auf einen gescheiterten Installationsprozess.
- Wichtige Intune-IME-Logs: `IntuneManagementExtension.log`, `AppWorkload.log`, `AppActionProcessor.log` in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`.
- Bei ConfigMgr heißen die passenden App-Logs u. a. `AppIntentEval.log`, `AppDiscovery.log` und `AppEnforce.log`.
- Installer-Exit-Code **0** ersetzt keinen Detection- und Anwendungstest. Bei MSI `1603` und `1618` sind Logkontext bzw. parallele Installation zu prüfen; `3010` bezeichnet einen nötigen Neustart.
- **Keine** Pakete, Caches, Zuweisungen, Sicherheitsrichtlinien oder Detection Rules ohne Ursachenbeleg und Freigabe verändern.

## Geplanter Lernablauf

1. Nur das fiktive Eingangsticket lesen; eigene Hypothesen zu Zuweisung, IME, Content, Installer, Detection und Anwendung bilden.
2. Ohne Runbook erklären, welche **erste lesende Prüfung** die Fehlerebene trennt.
3. Befunde im isolierten Windows-Testsystem (falls vorhanden und berechtigt) reproduzieren; keine produktiven Changes.
4. Eigenes Runbook/Ticketkommentar schreiben und mit `RB-046_Praxis-Runbook.md` vergleichen.
5. Technische Aussagen gegen die Microsoft-Originalquellen und konkrete Testergebnisse prüfen.
6. Geeignete Wissens-, Verständnis- und Diagnosekarten für Anki auswählen; Erfolg nicht nur über Wiedererkennen messen.

**Praktikabilität:** Ohne einen berechtigten Intune-Testtenant lassen sich lokale Windows-Installer- und Detection-Mechanismen üben, aber ein echter Intune-Zuweisungs-/Check-in-Prozess kann nicht als praktisch validiert gelten.

## Herstellerquellen (offizielle Microsoft-Dokumentation, recherchiert 23.11.2026)

1. Microsoft Intune – Win32-App-Problembehandlung: https://learn.microsoft.com/de-de/intune/app-management/deployment/troubleshoot-win32
2. Microsoft Intune – Win32-App hinzufügen, zuweisen, erkennen: https://learn.microsoft.com/en-us/intune/app-management/deployment/add-win32
3. Microsoft Intune Management Extension: https://learn.microsoft.com/de-de/intune/device-management/tools/management-extension-windows
4. Microsoft Intune – App-Installationsfehlercodes: https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/app-install-error-codes
5. Windows Installer – Rückgabecodes: https://learn.microsoft.com/de-de/windows/win32/msi/error-codes
6. Microsoft – msiexec-Protokollierung: https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/msiexec
7. Microsoft Configuration Manager – Protokolldateien: https://learn.microsoft.com/de-de/intune/configmgr/core/plan-design/hierarchy/log-files
8. Microsoft – Win32-App-Bereitstellungsprozess: https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/develop-deliver-working-win32-app-via-intune

Die vollständige Zuordnung `[Q1]`–`[Q10]` steht am Ende des Lernartikels.

## Spätere Website-Veröffentlichung

- ZIP vollständig entpacken; relative Markdown-Bildpfade unverändert belassen oder bei der Einbindung bewusst anpassen.
- Die Website wird **nicht automatisch** geändert. Veröffentlichung und Lab-Validierung erfolgen separat.
- Bildkennzeichnung: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**
- Transparenzhinweis: **„Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung der beschriebenen Maßnahmen steht noch aus.“**
- Codeblöcke als lesend bzw. ändernd kennzeichnen; unbewiesene Beispielergebnisse nicht als reale Diagnose darstellen.

**Projektstatus:** RB-046 dokumentiert und für späteres Labortraining vorbereitet, **nicht** praktisch abgeschlossen.
