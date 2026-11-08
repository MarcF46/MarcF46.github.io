# RB-014 – Benutzer benötigt Zugriff auf eine Anwendung

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Datum:** 08.11.2026  
**Bearbeitungsstand:** Technisch recherchiert; keine praktische Validierung.

## Dateien

| Datei | Inhalt |
|---|---|
| `RB-014_Lernartikel.md` | Ausführlicher Lernartikel (15 Abschnitte) mit Quellen, Begriffserklärungen, Diagnosen, kommentierten PowerShell-Befehlen, Lernkontrolle und fiktivem Ticket |
| `RB-014_Praxis-Runbook.md` | Kompakte L1-/L2-Arbeitsanweisung |
| `assets/rb014_henne_ei_anwendungszugriff.png` | Henne-Ei-Infografik zu Authentifizierung und Anwendungsautorisierung |
| `assets/rb014_diagnosebaum.svg` | Technischer Diagnose-Entscheidungsbaum als Vektorgrafik |
| `assets/rb014_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums |

## Einbindung auf GitHub Pages

Die Verweise in den Markdown-Dateien sind relativ und gehen von der obigen Ordnerstruktur aus. Die Henne-Ei-Grafik kann am Beginn der Detailseite stehen; der Diagnosebaum gehört in den Abschnitt „Diagnose-Entscheidungsbaum“. Für das Portal lässt sich die bestehende `assets/support.css`-Gestaltung des GitHub-Repositorys wiederverwenden.

**Empfohlene Navigation:** Projektübersicht → RB-014 Lernartikel → Praxis-Runbook → Quellen. Die Markdown-Originaldateien bleiben als Nachweis der Ausgangsversion erhalten.

## Technische Leitlinien

- Eine **App-Zuweisung** ist nicht dasselbe wie eine **App-Rolle**; auch eine erfolgreiche Anmeldung ist nicht automatisch eine fachliche Berechtigung.
- **AADSTS50105** nur nach Prüfung von Zuweisungspflicht, tatsächlicher Zuweisung und direkter Gruppenmitgliedschaft behandeln.
- **Conditional Access, MFA und Administratorrollen** dürfen nicht pauschal zum Umgehen von Anmeldefehlern verändert werden.
- Graph- und AD-PowerShell-Befehle im Artikel sind **lesende Diagnosebeispiele**. Änderungen erfordern Freigabe und geeignete Rechte.
- Fallbeispiel und Ticket sind **fiktiv**, die Anwendung `Fabrikam CRM` ist ein Platzhalter.
- Kein Produktivsystem oder Benutzerkonto wurde für dieses Paket geändert.

## Quellen

Die technischen Quellen von Microsoft Learn stehen vollständig im Lernartikel; zentrale Dokumentationen sind die [App-Zuweisung](https://learn.microsoft.com/de-de/entra/identity/enterprise-apps/assign-user-or-group-access-portal), [AADSTS50105](https://learn.microsoft.com/de-de/troubleshoot/entra/entra-id/app-integration/error-code-AADSTS50105-user-not-assigned-role) und [Entra-Provisioning](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/how-provisioning-works).

**Grafikherkunft:** Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Keine Screenshots einer realen Supportumgebung.
