# RB-003 – Passwort vergessen: kompaktes Praxis-Runbook

**Zweck:** Checkliste für den Helpdesk – **kein Ersatz für Sicherheitsrichtlinien und Identitätsprüfung**.  
**Version:** 1.0 · **7. November 2026** · **Status:** Recherchiert, nicht praktisch validiert  
**Systeme:** Lokales Active Directory (AD DS), Microsoft Entra ID und hybride Umgebungen.

> **STOPP:** Bei unklarer Identität, Verdacht auf Kontokompromittierung, fehlender Berechtigung oder unklarem Kontoursprung **nicht** zurücksetzen. An den zuständigen Identity-/Security-Prozess eskalieren. Keine Kennwörter, PINs oder Recoverycodes in Tickets speichern.

## 1. L1-Aufnahme und Prüfungen

- [ ] Genaue Meldung, Benutzerkonto, Gerät und Standort (Büro/Homeoffice) erfassen.
- [ ] **Kennwort oder Windows-Hello-PIN?** Kontosperre und Verbindungsproblem ausschließen.
- [ ] **Identität nach vorgegebenem sicheren Verfahren nachweislich geprüft?** Falls nein: STOPP.
- [ ] Existiert ein freigegebener Selbsthilfeprozess **SSPR (Self-Service Password Reset)**?
- [ ] **Wo liegt die Kennwortquelle?** Lokal-AD, Cloud-only Entra ID, Hybrid oder extern?
- [ ] Darf meine Rolle **dieses** Konto zurücksetzen? Administratorkonten ggf. eskalieren.

## 2. Richtigen technischen Weg auswählen

| Identitätsquelle | Werkzeug | Aktion |
|---|---|---|
| AD DS (lokale Domäne) | ADUC (`dsa.msc`) oder AD-PowerShell | Nach Freigabe Kennwort zurücksetzen; ggf. Wechsel erzwingen |
| Entra ID (Cloud-only) | [SSPR](https://aka.ms/sspr) oder Entra Admin Center | Nutzer-Selbsthilfe / autorisierter Adminreset |
| Hybrid, AD-geführt | Lokal-AD; Entra nur mit kompatiblem Writeback | Kontoursprung und Writeback **vorher** kontrollieren |
| Externes Konto | Heimorganisation | Nicht im fremden Tenant zurücksetzen |
| Windows-Hello-PIN | Windows-Hello-Prozess | Keine unnötige Domain-Kennwortrücksetzung |

## 3. Lokales AD: vor dem Reset (nur lesend)

**Ausführungsort:** Berechtigter Administrationsrechner mit RSAT-/AD-Modul und Domänenverbindung.

```powershell
# Lädt die AD-Verwaltungsbefehle.
Import-Module ActiveDirectory

# Prüft Identität, Kontosperre und Kennwortstatus.
Get-ADUser -Identity 'm.mustermann' -Properties Enabled,LockedOut,PasswordExpired |
    Select-Object SamAccountName,Enabled,LockedOut,PasswordExpired
```

**Abbruch:** Falscher Benutzer, deaktiviertes Konto, fehlende Freigabe oder ungewöhnliche Sicherheitshinweise.

## 4. Lokal-AD-Reset: erst Simulation, dann genehmigte Änderung

**Wirkung:** `Set-ADAccountPassword` verändert das Kennwort; nur nach Identitätsprüfung und Freigabe in geeigneter Umgebung ausführen.

```powershell
# Beispielkonto – vor Ausführung die richtige Identität bestätigen.
$identity = 'm.mustermann'

# Temporäres Kennwort verdeckt abfragen; nicht in Skripte schreiben.
$newPassword = Read-Host 'Temporäres Kennwort' -AsSecureString

# DRY RUN: Zeigt nur an, welche Änderung erfolgen würde.
Set-ADAccountPassword -Identity $identity -Reset -NewPassword $newPassword -WhatIf
```

**PRODUKTIVSCHRITT – getrennt ausführen, ausschließlich nach nachweislicher Identitätsprüfung und Freigabe:**

```powershell
# ÄNDERT DAS AD-KENNWORT: -Confirm fordert eine Bestätigung an.
Set-ADAccountPassword -Identity $identity -Reset -NewPassword $newPassword -Confirm

# OPTIONAL, NUR WENN GEEIGNET: Kennwortwechsel beim nächsten Login.
# Dieser Schritt ist eine gesonderte Änderung.
Set-ADUser -Identity $identity -ChangePasswordAtLogon $true -Confirm

# Entfernt die Variable aus der aktuellen Sitzung.
Remove-Variable newPassword -ErrorAction SilentlyContinue
```

**Achtung:** Nicht beide Codeblöcke unbesehen ausführen. Der zweite ändert ein Konto. Bei Homeoffice-/Offlinegeräten vor `ChangePasswordAtLogon` die Domänen-Erreichbarkeit klären. Ein Kennwortreset **entsperrt ein gesperrtes Konto nicht zwangsläufig** – dann zusätzlich RB-002 befolgen.

## 5. Entra ID: kurzer Administrationsweg

Nach dokumentierter Identitätsprüfung und Rollenkontrolle: **Entra Admin Center → Entra ID → Benutzer → richtiges Konto → Kennwort zurücksetzen**. Der Dienst erzeugt beim Reset ein temporäres Kennwort. **Nur sicher übergeben** und bei nächster Anmeldung ordnungsgemäß ändern lassen. Für Cloud-only Benutzer kann stattdessen ein vorher eingerichteter SSPR-Prozess verwendet werden.

**Hybrid:** Bei synchronisierten, AD-geführten Konten nicht davon ausgehen, dass ein beliebiger Entra-Reset das lokale AD aktualisiert. *Password Writeback* und Zulässigkeit prüfen.

## 6. Erfolgskontrolle

- [ ] Benutzer konnte die erforderliche Kennwortänderung auf dem **geeigneten Online-Anmeldeweg** abschließen.
- [ ] Windows / Microsoft 365 und relevante Ressourcen sind wieder zugänglich.
- [ ] Kein erneuter Sperrfehler oder Hinweis auf unerwünschte Logins.
- [ ] Ggf. gespeicherte alte Anmeldedaten auf weiteren Geräten im freigegebenen Prozess korrigiert.
- [ ] Kein temporäres Kennwort, keine PIN und kein Recoverycode im Ticket.

## 7. L2- / Security-Eskalation

- Identität nicht sicher prüfbar oder erhöhte Privilegien / Admin- oder Servicekonto betroffen.
- SSPR/Password Writeback funktioniert nicht, Rechte oder Kennwortquelle unklar.
- Lokales AD kann nicht erreicht werden; DC, VPN oder Replikation auffällig.
- Kennwortreset erfolgreich, Windows-/Cloud-Anmeldung weiterhin fehlerhaft.
- Verdacht auf Kompromittierung, ungewöhnliche MFA-/Anmeldeereignisse, massenhafte Reset-Anfragen.

## 8. Muster-Ticketabschluss (fiktiv)

**INC-003:** Identität nach internem Verfahren verifiziert. Zielkonto `m.mustermann` im lokalen AD geprüft; aktiv und nicht gesperrt. Kennwort mit freigegebener Methode zurückgesetzt; sichere Übergabe durchgeführt. Benutzer hat sein Kennwort bei erreichbarer Domäne geändert und erfolgreiche Anmeldung sowie Zugriff auf benötigte Unternehmensressourcen bestätigt. Keine Geheimnisse im Ticket erfasst. **Status: Gelöst.**

## 9. Schnellreferenzen

- [AD-Kennwortreset: Set-ADAccountPassword](https://learn.microsoft.com/en-us/powershell/module/activedirectory/set-adaccountpassword)
- [Set-ADUser: ChangePasswordAtLogon](https://learn.microsoft.com/de-de/powershell/module/activedirectory/set-aduser)
- [Microsoft Entra: Kennwortreset](https://learn.microsoft.com/de-de/entra/fundamentals/users-reset-password-azure-portal)
- [SSPR: Funktionsweise](https://learn.microsoft.com/de-de/entra/identity/authentication/concept-sspr-howitworks)
- [Password Writeback bei Hybrid](https://learn.microsoft.com/de-de/entra/identity/authentication/tutorial-enable-sspr-writeback)

**Mehr technische Hintergründe:** [RB-003 – Lernartikel](RB-003_Lernartikel.md). Dokumentations- und Quellenstand 7. November 2026; praktische Validierung noch ausstehend.
