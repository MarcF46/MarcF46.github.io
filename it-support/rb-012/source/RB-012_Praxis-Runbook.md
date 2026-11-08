# RB-012 – Praxis-Runbook: MFA funktioniert nicht

**Zweck:** Kompakte L1-/L2-Arbeitsanweisung · **Version 1.0 (08.11.2026)**  
**Status:** Fachlich recherchiert, **nicht praktisch validiert**. Alle Beispielkonten sind fiktiv.

## 1. Ticketaufnahme (L1)

- [ ] Benutzer, UPN (Anmeldename), betroffene App, Uhrzeit/Zeitzone, Gerät und exakte Fehlermeldung erfassen.
- [ ] Welcher Fall? **A** Push fehlt, **B** Code abgelehnt, **C** Smartphone verloren/ersetzt, **D** Anmeldung durch Richtlinie blockiert.
- [ ] Hat der Benutzer **selbst** eine Anmeldung ausgelöst? Unbekannte Push-Anfragen → **nicht bestätigen**, Security-Prozess.
- [ ] Sind weitere Benutzer betroffen? Gab es ein Update, neues Handy oder Richtlinienänderungen?
- [ ] **Nie Kennwörter, TAP-Werte, Einmalcodes oder Authenticator-Bestätigungen vom Benutzer verlangen.**

## 2. Schnelle Fehlerklassifizierung

| Befund | Erster sinnvoller Prüfweg |
|---|---|
| Kennwort/Primäranmeldung scheitert | RB-001/RB-003 statt MFA-Reset |
| Keine Push-Nachricht | Smartphone online? App aktuell? Benachrichtigungen/„Nicht stören“? Entra-Anmeldedetails? |
| Einmalcode falsch/abgelaufen | Richtiger Account, Codeart, automatische Smartphone-Zeit? |
| Smartphone verloren, keine Ersatzmethode | Identitätsprüfung; autorisierter TAP-/Recovery-Prozess |
| MFA erfolgreich, dennoch blockiert | Conditional Access, Authentifizierungsstärke, Gerätekonformität |
| Unerwartete MFA-Push-Anfrage | Sicherheitsverdacht, keine Freigabe erteilen |

## 3. L1: Lokale, nicht verändernde Prüfungen

- [ ] Smartphone hat Netzwerkzugang (WLAN/mobile Daten), Flugmodus aus.
- [ ] Authenticator-App aktuell, richtiges Geschäfts-/Schulkonto gewählt.
- [ ] Benachrichtigungen und Gerätemodi prüfen; bei TOTP automatische Zeit aktiv.
- [ ] Number Matching: Nur die Nummer des selbst gestarteten Anmeldeversuchs bestätigen.
- [ ] Falls erlaubt und vorhanden: andere **bereits registrierte** Anmeldemethode wählen.
- [ ] Keine App-/Kontolöschung, kein pauschales Deaktivieren von MFA oder Conditional Access.

## 4. L1/L2: Serverseitige Entra-Anmeldeprotokolle

**Ausführungsort:** [Entra Admin Center](https://entra.microsoft.com/) mit geeigneter Rolle, z. B. Reports Reader für Sign-in Logs.

- [ ] **Entra ID → Überwachung & Integrität → Anmeldeprotokolle** öffnen.
- [ ] Benutzer-UPN, Zeit und Anwendung filtern.
- [ ] **Authentication Details**: verlangte/versuchte Methode und Ergebnis.
- [ ] **Conditional Access**: angewendete/blockierende Richtlinien.
- [ ] **AADSTS-Code**, Correlation ID und Zeitstempel für Ticket übernehmen.

| Code | Orientierung |
|---|---|
| **AADSTS500121** | MFA wurde nicht abgeschlossen – Grund im Detail prüfen. |
| **AADSTS53000** | Gerät nicht konform – Geräte-/Intune-Team einbeziehen. |
| **AADSTS53003** | Conditional Access blockiert – betroffene Richtlinie untersuchen. |

## 5. Lesende PowerShell-Abfragen (nur wenn berechtigt)

**Ausführungsort:** Freigegebener Admin-Rechner mit Microsoft-Graph-Modulen. Graph-Berechtigungen und Entra-Rollen müssen passen. Das Entra-Portal ist häufig der einfachere Erstweg.

```powershell
# Verfügbarkeit des benötigten Microsoft-Graph-Moduls prüfen.
Get-Module -ListAvailable Microsoft.Graph.Reports

# Berechtigte Verbindung mit LESE-Scopes aufbauen.
Connect-MgGraph -Scopes 'AuditLog.Read.All','UserAuthenticationMethod.Read.All'

# Fiktives Benutzerkonto für die Abfrage festlegen.
$userUpn = 'm.mustermann@firma.example'

# Höchstens zehn Entra-Anmeldeereignisse dieses Benutzers abfragen.
Get-MgAuditLogSignIn -Filter "userPrincipalName eq '$userUpn'" -Top 10 |
    Select-Object CreatedDateTime, AppDisplayName, CorrelationId,
        @{Name='ErrorCode';Expression={$_.Status.ErrorCode}}

# Registrierte Authenticator-Methoden auflisten (ohne Änderungen).
Get-MgUserAuthenticationMicrosoftAuthenticatorMethod -UserId $userUpn |
    Select-Object Id, DisplayName, DeviceTag, PhoneAppVersion
```

**Auswertung:** Eine Methode kann registriert, aber nicht mehr nutzbar sein; eine Policy kann eine andere Authentifizierungsstärke verlangen. Anmeldung und Geräteanzeige immer korrelieren.

## 6. Wiederherstellung nur nach Identitätsprüfung

- [ ] Benutzeridentität nach freigegebenem Unternehmensverfahren verifizieren.
- [ ] Wenn noch eine zugelassene Methode verfügbar ist: Benutzer pflegt seine Sicherheitsinformationen unter [mysignins.microsoft.com/security-info](https://mysignins.microsoft.com/security-info).
- [ ] Sonst **Temporary Access Pass (TAP)** nur bei erlaubter Richtlinie durch berechtigte Administration erstellen, sicher übergeben und für die Registrierung einer neuen Methode verwenden.
- [ ] Alte nicht mehr verfügbare Methoden erst nach erfolgreichem Test und gemäß Richtlinie entfernen.
- [ ] **„Require re-register MFA“** kann Methoden löschen/zurücksetzen; nicht ungeprüft ausführen.
- [ ] Keine Geheimniswerte im Ticket und keine Sicherheitsregeln pauschal abschalten.

## 7. Funktionstest und Abschluss

- [ ] Anmeldung an der ursprünglich betroffenen App funktioniert mit freigegebener Methode.
- [ ] Entra-Anmeldeprotokoll zeigt den passenden erfolgreichen Vorgang.
- [ ] Richtlinienanforderungen werden weiterhin eingehalten.
- [ ] Nicht mehr verwendbare Methoden nach Freigabe bereinigt.
- [ ] Ticket mit Ursache, Prüfung, Freigabe, Änderung und Erfolg dokumentieren.

## 8. Eskalation

Bei Sicherheitsverdacht, unklarer Identität, mehreren betroffenen Benutzern, nicht zulässiger Wiederherstellungsmethode, fehlenden Rechten, Conditional-Access-/Authentifizierungsstärke-Problemen oder Administratorsperren an **Identity/Security/L2** eskalieren. Mitgeben: **UPN, Uhrzeit, Anwendung, AADSTS-Code, Correlation ID, dokumentierte Prüfschritte**. Keine PIN, TAP, TOTP, Authenticator-QR-Geheimnisse oder Zugangstoken übermitteln.

**Vertiefung:** [Ausführlicher Lernartikel](RB-012_Lernartikel.md) mit Grundlagen, Diagramm, kommentierten Befehlen, Quellen und Lernfragen. Alle Befunde beziehen sich auf fiktive Beispiele.
