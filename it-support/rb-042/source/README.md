# RB-042 – Windows-Benutzerprofil beschädigt (L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle · **Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Quellen recherchiert, Dokumentationspaket erstellt, **nicht praktisch validiert**. Sämtliche Beispielbenutzer, Server, Zeiten und Messwerte sind **fiktiv**.

## Paketstruktur – genau sechs Dateien

| Datei | Zweck |
|---|---|
| `RB-042_Lernartikel.md` | Ausführlicher Lernartikel in 15 Kapiteln; Ursachen, PowerShell, Quellen, fiktive Übungsfälle, Active Recall |
| `RB-042_Praxis-Runbook.md` | Praxistaugliche L2-Checkliste mit 10 Arbeitsabschnitten und datenschonender Eskalation |
| `assets/rb042_henne_ei_benutzerprofil.png` | Henne-und-Ei-Infografik im professionelleren Comicstil |
| `assets/rb042_diagnosebaum.svg` | Technischer Diagnose-Entscheidungsbaum als skalierbare Vektorgrafik |
| `assets/rb042_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Lernnotizen |
| `README.md` | Dieser Paketindex und Hinweise zur Verwendung |

## Kernaussagen

1. Eine erfolgreiche Benutzeranmeldung und das korrekte Laden des **ursprünglichen Profils** sind unterschiedliche Vorgänge.
2. Bei einem **temporären Profil** sind neu erstellte oder bearbeitete Dateien vor Abmeldung sofort zu sichern; ein leerer Desktop bedeutet nicht automatisch, dass das Originalprofil gelöscht wurde.
3. Der Diagnosepfad geht über **User Profile Service → korrekte SID/ProfileList-Zuordnung → Profilordner/ACL → Speicherplatz → ggf. Roaming-/FSLogix-Profil**.
4. `Win32_UserProfile`, Ereignislogs und ProfileList sind **lesende Diagnosen**. `ProfileList`-/`.bak`-Registry-Reparaturen und `C:\Users`-Löschungen sind ausdrücklich **keine** automatische Lösung.
5. Erfolg ist erst bestätigt, wenn der **richtige Benutzer** nach einem kontrollierten erneuten Logon wieder alle beauftragten Dateien und Einstellungen verwenden kann.

## Sichere spätere Laborvalidierung

- Isolierte Windows-11-VM mit **Snapshot, vollständig gesichertem Testprofil und zweitem berechtigten Administrator** vorbereiten.
- Testbenutzer und bewusst unkritische Testdateien anlegen; normale An- und Abmeldung sowie `Get-CimInstance Win32_UserProfile`, Ereignisanzeige und Speicherplatzprüfungen dokumentieren.
- Fehlerfälle zunächst mit **fiktiven Ereignissen und Hypothesen** trainieren. Echte Störungen **nur reversibel und mit separatem Rückfalltest** simulieren; keine produktiven Konten oder wertvolle Dateien beschädigen.
- Den Diagnosebaum verwenden, aber die Ursache selbstständig ohne Lesehilfe bestimmen und die resultierenden Runbook-Schritte begründen.
- 7 und 21 Tage später neue Fehlerhinweise ohne vorgegebene Lösung durchspielen.

## Herstellerquellen (offizielle Microsoft-Links)

- https://support.microsoft.com/de-de/windows/security/identity-signin/fix-a-corrupted-user-profile
- https://support.microsoft.com/en-us/windows/security/identity-signin/we-can-t-sign-in-to-your-account-error-message
- https://learn.microsoft.com/de-de/troubleshoot/windows-server/user-profiles-and-logon/troubleshoot-user-profiles-events
- https://learn.microsoft.com/en-us/windows/win32/shell/about-user-profiles
- https://learn.microsoft.com/en-us/previous-versions/windows/desktop/usm/win32-userprofile
- https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-attach-detach
- https://learn.microsoft.com/de-de/fslogix/troubleshooting-events-logs-diagnostics
- https://learn.microsoft.com/de-de/troubleshoot/windows-server/user-profiles-and-logon/event-1530-application-log

## Website-Integration und Transparenz

Die Website `https://marcf46.github.io/` bleibt **unverändert**; dieses ZIP ist für spätere Veröffentlichung vorbereitet. Beim Einbau die relativen Markdown-Bildpfade übernehmen und die bestehende Gestaltung nicht ohne Auftrag verändern.

**KI-Kennzeichnung:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“

**Transparenzhinweis:** „Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung der beschriebenen Maßnahmen steht noch aus.“
