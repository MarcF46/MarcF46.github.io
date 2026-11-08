# RB-014 – Praxis-Runbook: Zugriff auf eine Anwendung bereitstellen

**Service Request / Incident:** SR-014 · **Bereich:** IAM / AD / Entra / Fachanwendung  
**Status:** Recherchierte Arbeitsanweisung, **nicht praktisch validiert** · **Version:** 1.0 (08.11.2026)

> **Ziel:** Die richtige Anwendung und die minimal genehmigte Rolle bereitstellen oder eine bestehende Zugriffsproblematik diagnostizieren – ohne Sicherheitsmaßnahmen auszuhebeln.

## 1. Ticketaufnahme und Freigabe

- **Wer?** Eindeutiger Benutzer, Anmeldekonto/UPN, Abteilung.
- **Welche Anwendung?** Genaue App, URL, Mandant/Umgebung.
- **Welche Aktion?** Lesen, Bearbeiten, Adminfunktion – klar unterscheiden.
- **Was passiert?** Vollständige Meldung, Fehlercode, Zeitpunkt und betroffene Geräte.
- **Neuer Bedarf oder Störung?** Fachliche Genehmigung, Application Owner, Rolle, Dauer, Lizenz prüfen.

**Keine Berechtigungsvergabe ohne Freigabe.** Zugriff und Rollen nach Least Privilege (geringstmögliche Rechte).

## 2. Erste Diagnose und Zugriffsweg

| Beobachtung | Prüfen / Maßnahme |
|---|---|
| App-URL lädt nicht | DNS, VPN, Gateway, TCP-Port 443; RB-010/RB-011 verwenden |
| AADSTS50105 | Entra-Unternehmensanwendung → „Zuweisung erforderlich?“ → Benutzer/Gruppen direkt zugewiesen? |
| Anmeldung scheitert trotz Zuweisung | Entra-Anmeldeprotokoll, Fehlercode, Conditional Access und MFA prüfen |
| Anmeldung klappt, Funktion fehlt | App-Rolle, anwendungsinterne Rechte, Lizenz und Fachfreigabe prüfen |
| Zuweisung vorhanden, Zielkonto fehlt | Provisioning-/SCIM-Protokolle und Ziel-App prüfen |
| Neue Gruppenmitgliedschaft wirkt nicht | Tatsächliche Mitgliedschaft, neue Sitzung/Token, Provisioning prüfen |

**Ausführungsorte:** Entra Admin Center / AD-Administrationsrechner / App-Adminportal. Fernzugriff auf den Benutzer-PC ist häufig nicht nötig.

## 3. Lesende Schnelltests

**Windows-Client oder Support-PC – Netzwerk:**

```powershell
# DNS-Namensauflösung der Beispielanwendung kontrollieren.
Resolve-DnsName -Name 'crm.firma.example'

# Prüft die HTTPS-TCP-Verbindung; keine Aussage über Benutzerrechte.
Test-NetConnection -ComputerName 'crm.firma.example' -Port 443
```

**AD-Verwaltungsrechner mit RSAT und Lesezugriff:**

```powershell
# Abfrage der Gruppenmitgliedschaften des fiktiven AD-Kontos.
Get-ADPrincipalGroupMembership -Identity 'l.meyer' |
    Select-Object Name, SamAccountName |
    Sort-Object Name
```

**Betroffener Client in der Sitzung des betroffenen Benutzers:**

```powershell
# Zeigt Gruppen im aktuellen Windows-Anmeldetoken an.
whoami /groups
```

**Entra Admin Center:** Entra ID → Überwachung/Anmeldeprotokolle → nach Benutzer, App und Zeitpunkt filtern → Fehlercode, Korrelations-ID, Conditional-Access-Auswertung prüfen.

**Microsoft Graph PowerShell – nur mit genehmigter Verzeichnisleseberechtigung:**

```powershell
# Anmeldung am richtigen Entra-Mandanten mit lesendem Directory-Scope.
Connect-MgGraph -Scopes 'Directory.Read.All'

# Holt das fiktive Benutzerobjekt.
$user = Get-MgUser -UserId 'l.meyer@firma.example'

# Liest App-Rollenzuweisungen (auch über direkte Gruppenmitgliedschaft möglich).
Get-MgUserAppRoleAssignment -UserId $user.Id -All |
    Select-Object ResourceDisplayName, AppRoleId
```

**Achtung:** Die Graph-Abfrage erfordert neben Berechtigungen ggf. passende Entra-Rollen. `AppRoleId` gegen die konkreten App-Rollen abgleichen; „Standardzugriff“ ist nicht automatisch eine benannte Fachrolle.

## 4. Änderungsentscheidung

1. Liegt eine **gültige fachliche Freigabe** vor? Falls nein: Anfrage klären, nichts ändern.
2. Fehlt eine gültige **App-Zuweisung**? Durch berechtigte Administration Benutzer oder **direkte** Gruppe mit richtiger Rolle zuweisen. Nicht pauschal Zuweisungspflicht deaktivieren.
3. Ist **Conditional Access** die Ursache? Richtlinienauswertung dokumentieren und an zuständiges Security-/IAM-Team übergeben; keine globale Lockerung.
4. Fehlt die **anwendungsinterne Rolle** oder Lizenz? Fachanwendungsbetreuung/License Owner einbeziehen.
5. Scheitert **Provisioning**? Synchronisationsprotokolle und Attributmapping untersuchen; L2.
6. Rechte geändert, aber nicht wirksam? Sichere Neuanmeldung und Token-/Sitzungszustand prüfen; nicht dieselbe Zuweisung mehrfach setzen.

## 5. Funktionstest und Abschluss

- Mit dem **betroffenen Benutzer** und dem vorgesehenen Konto testen (nicht nur mit globalem Admin).
- App öffnen und **konkret genehmigte Funktion** testen; keine unnötigen Datenänderungen.
- Genehmigung, Gruppe/App-Rolle, beteiligtes System, Prüfbefund, Änderung, Testergebnis und ggf. Befristung dokumentieren.
- Eskalieren, wenn SSO-Claims, App-Rollenmapping, Provisioning, Lizenzierung oder komplexe Richtlinien betroffen sind.

### Ticketkommentar – Muster (fiktiv)

**SR-014 | Fehlerbild:** Benutzer erhält beim CRM-Zugriff AADSTS50105.  
**Freigabe:** Fachverantwortliche genehmigt die Rolle „SalesReader“.  
**Diagnose:** App verlangt Benutzerzuweisung; keine direkte Zuweisung oder gültige direkte Gruppenmitgliedschaft vorhanden.  
**Maßnahme:** Berechtigte Administration weist genehmigte App-Gruppe/Rolle zu.  
**Ergebnis:** Anmeldung und autorisierte Lesefunktion mit betroffenem Benutzer geprüft.  
**Status:** Gelöst – *nur fiktives Dokumentationsbeispiel*.

## 6. Quellen und Verweise

- [Microsoft – Benutzer/Gruppen einer App zuweisen](https://learn.microsoft.com/de-de/entra/identity/enterprise-apps/assign-user-or-group-access-portal)
- [Microsoft – AADSTS50105](https://learn.microsoft.com/de-de/troubleshoot/entra/entra-id/app-integration/error-code-AADSTS50105-user-not-assigned-role)
- [Microsoft – Entra-Anmeldefehler untersuchen](https://learn.microsoft.com/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
- [Microsoft – Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Microsoft – Provisioning](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/how-provisioning-works)

Ausführliche Erläuterungen, kommentierte Befehle und Diagnoseübungen: [RB-014 – Lernartikel](RB-014_Lernartikel.md).

**Validierungsstand:** Recherchiert, nicht praktisch getestet. Keine realen Administrationsänderungen durchgeführt.
