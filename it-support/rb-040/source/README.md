# RB-040 – Gruppenrichtlinie wird nicht angewendet (L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle · **Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Inhalt **recherchiert und theoretisch nachvollzogen, nicht praktisch validiert**. Es wurden **keine produktiven GPOs verändert**. Beispielobjekte, Ticketkommentare und Fallmessungen sind fiktiv.

## Paketinhalt (sechs Dateien)

| Datei | Funktion |
|---|---|
| `RB-040_Lernartikel.md` | Ausführlicher Lernartikel (15 Kapitel) mit Grundlagen, Microsoft-Quellen, Beispielen, Active Recall und Transfertraining |
| `RB-040_Praxis-Runbook.md` | Kompaktes L2-Runbook (10 Abschnitte) inklusive Diagnosebefehlen und Sicherheitsgate |
| `assets/rb040_henne_ei_gruppenrichtlinie.png` | Henne-und-Ei-Infografik im professionelleren Stil der bisherigen Ticketreihe |
| `assets/rb040_diagnosebaum.svg` | Technischer Diagnose-Entscheidungsbaum als skalierbare Vektorgrafik |
| `assets/rb040_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Notizen |
| `README.md` | Paket- und Quellenbeschreibung, Validierungsstatus |

## Lernziele

1. Existenz, Verknüpfung und tatsächliche Anwendung einer GPO unterscheiden.
2. Die vier Befundgruppen Scope, Filter, Verarbeitung und CSE/Einzelwirkung trennen.
3. `gpresult /r` und `/h` im **korrekten Benutzer-/Computer-Kontext** interpretieren.
4. Security-/WMI-Filter, LSDOU, Enforced, Loopback und SYSVOL ohne blindes Ändern untersuchen.
5. Den abschließenden **Ist-Nachweis am ursprünglichen Client** führen.

## Empfohlene praktische Validierung

Ein isoliertes AD-Lab mit 1 Domain Controller und 1–2 Windows-Clients (oder gemeinsam genutzte Testumgebung) genügt für erste Scope-/Filter-Fälle; für DFSR-Replikationsszenarien sind mehrere DCs erforderlich. Pro Fall bewusst nur **eine Ursache** verändern und vorher den Ausgangszustand sichern. Alternativ zunächst mithilfe fiktiver gpresult-Berichte Diagnoseentscheidungen trainieren, solange kein vollständiges AD-Lab vorhanden ist.

**Wichtiger Hinweis:** `gpupdate /force` verändert den lokalen Richtlinienzustand und kann Logoff/Reboot benötigen. Keine produktiven GPO-Links, Sicherheitsfilter, OU, SYSVOL oder DFSR ohne Freigabe ändern.

## Quellen (Microsoft Learn)

- [Group Policy processing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing)
- [Applying Group Policy troubleshooting guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-server/group-policy/applying-group-policy-troubleshooting-guidance)
- [gpresult](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpresult)
- [Group Policy Modeling and Results](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-modeling-results)
- [Group Policy preferences](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-preferences)
- [Troubleshooting SYSVOL/NETLOGON DFS Replication](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-missing-sysvol-and-netlogon-shares)

## Website-Integration (später)

Für `marcf46.github.io` später Inhalte aus Markdown prüfen und entsprechend der bestehenden Layout-/Navigationskonvention nach HTML übernehmen; Grafik-Assets mit relativen Links einbinden. **Keine Veröffentlichung / kein GitHub-Commit in diesem Arbeitsschritt**.

**Bildhinweis:** Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Grafik illustriert einen typischen Diagnosepfad; sie ist kein Ersatz für die fallabhängigen Entscheidungen im Runbook.
