# RB-050 – Praxis-Runbook: Offboarding – Benutzerzugänge sicher deaktivieren (L1/L2)

**Stand:** 23.11.2026 · **Version:** 1.0 · **Status:** Recherchiert, **nicht produktiv validiert**. Dieses Muster ist an die jeweilige HR-, Security-, Datenschutz- und Change-Policy anzupassen.

## 1. Ticket-Eingang, Freigabe und Wirksamkeitszeit

- [ ] HR-/Security-Auftrag mit Referenz, eindeutiger Person, Auslöser und **Zeitpunkt inkl. Zeitzone** vorhanden.
- [ ] Cloud-/AD-Identität (UPN, Objekt-ID und ggf. sAMAccountName) eindeutig zugeordnet.
- [ ] Zuständige Rollen für Identität, SaaS, Geräte, Daten, Lizenzen und Abnahme bestimmt.
- [ ] Geplant oder Sofortsperre? Schutzbedarf und Eskalationsstufe geklärt.

**STOP:** Keine Sperrung wegen Namensgleichheit, unklarem Auftrag oder ungeprüfter Benutzerkennung.

## 2. Vorbereiten: Abhängigkeiten und verantwortliche Stellen

- [ ] Cloud-only oder Hybrid (lokales AD als Quellsystem?) klären.
- [ ] Fachanwendungen, VPN, Remotezugänge, Adminrollen, SSO und eigene App-Konten inventarisieren.
- [ ] Firmenhardware/BYOD, Seriennummern, Eigentum, Rückgabe und Offline-Risiken erfassen.
- [ ] Daten-, Mail-, Lizenz- und Aufbewahrungsauftrag parallel an Data Owner / Exchange / Compliance geben.

**Bei Sofortaustritt:** Identitäts-/Sitzungssperre nicht auf eine längere Dateninventur verschieben; offene Besitz-/Retention-Fragen als Folgearbeit dokumentieren.

## 3. Autorisierte Sperrung im maßgeblichen Verzeichnis

- [ ] Zuständige Adminrolle und freigegebener Zeitpunkt bestätigt.
- [ ] Cloud-only: neue Anmeldung über Entra-Benutzerstatus blockieren.
- [ ] Hybrid: Benutzer im zuständigen lokalen AD deaktivieren und Cloudzustand/Sync kontrollieren.
- [ ] Bei Kompromittierung Security-Prozess zu Credential-Rotation und weiteren Risiken aktivieren.
- [ ] Ausführung, Zeitstempel, Zielobjekt und Audit-Nachweis dokumentieren.

**L1:** Auftrag und Status erfassen, berechtigtes Team beauftragen. **L2/Identity:** freigegebene Sperraktion ausführen; niemals blind eine gleichnamige Identität bearbeiten.

## 4. Sitzungen und weitere aktive Zugänge behandeln

- [ ] Entra-Sitzungen/Refresh-Tokens gemäß Verfahren widerrufen (separate Aktion von Kontosperrung).
- [ ] VPN-/Gateway- und RDS-Sitzungen prüfen; unabhängige SaaS-App-Sessions beim App-Owner widerrufen.
- [ ] AD-/Entra-Gruppen, App-Rollen, Direktberechtigungen und privilegierte Zugänge prüfen.
- [ ] API-Schlüssel, SSH-/Zertifikatszugänge, Passwörter gemeinsam genutzter Konten: Besitzer und Rotation prüfen.

**Wichtig:** Access-Token, App-Session-Cookie und Refresh-Token sind nicht identisch; Entra-Sitzungswiderruf garantiert keinen sofortigen Logout aller Drittanbieter-Apps. [Q2][Q3]

## 5. Geräte, Intune und Rückgabe

- [ ] Gerät mit Inventar-/Seriennummer zuordnen, Rückgabe/Verschlüsselungsstatus erfassen.
- [ ] Für Unternehmensgerät zulässige Sicherungs-, Wiederverwendungs- oder Isolierungsaktion festlegen.
- [ ] BYOD: `Retire` bzw. selektives Entfernen von Firmendaten nur nach Plattform-/Datenschutzprüfung.
- [ ] `Wipe` ausschließlich als explizit genehmigter, möglicherweise irreversibler Eingriff; Offline-Aufträge auf Erfolg prüfen.

**STOP:** Keine Fernlöschung, bevor Geräteidentität, Eigentum, Datenbedarf und Freigabe geklärt sind.

## 6. E-Mail/OneDrive/Teams-Daten und Aufbewahrung

- [ ] Mailbox-Zweck, Archiv, Litigation/Retention Hold und rechtlichen Aufbewahrungsbedarf geklärt.
- [ ] Falls Shared Mailbox vorgesehen: **vor Lizenzentzug** konvertieren, Größenvorgaben und Benutzerobjekt als Anker berücksichtigen.
- [ ] OneDrive-/SharePoint-Projektdateien nur an autorisierte Nachfolger übertragen.
- [ ] Teams-/Site-/Flow-/App-Eigentümerschaften und geschäftliche Kalender-/Prozessabhängigkeiten prüfen.
- [ ] Datenschutz/Legal bestätigen Umfang und Art der Übergabe sowie Fristen.

**Nicht:** automatisches Kopieren kompletter Privatbereiche, ungeprüfte Mailweiterleitung, Aufnahme personenbezogener Inhalte ins Supportticket.

## 7. Lizenz- und Kontobereinigung separat freigeben

- [ ] Schriftliche Freigabe nach Prüfung von Mailbox-Typ, Archiv/Hold, OneDrive/Retention, Serviceabhängigkeiten.
- [ ] Lizenz nur entfernen, wenn Aufbewahrung und benötigte Dienste abgesichert sind.
- [ ] Konto **nicht** löschen, wenn es als Anker einer weiterbestehenden Shared Mailbox gebraucht wird.
- [ ] Benutzerlöschung erst nach gesonderter Entscheidung; Fristen und Wiederherstellungswege erfassen.
- [ ] Task-Owner, geplanten Zeitpunkt und spätere Nachkontrolle dokumentieren.

**STOP:** Niemals Lizenzentzug oder `Remove-MgUser` nur deshalb ausführen, weil „Offboarding fertig“ im Ticket steht.

## 8. Lesende Prüfungen (keine Statusänderung)

```powershell
# Microsoft Graph PowerShell SDK und genehmigte Leseberechtigungen vorausgesetzt
Connect-MgGraph -Scopes 'User.Read.All','Directory.Read.All'
$upn = 'mira.seidel@firma.example'  # fiktiv
Get-MgUser -UserId $upn -Property 'Id,DisplayName,UserPrincipalName,AccountEnabled,OnPremisesSyncEnabled' |
  Select-Object Id,DisplayName,UserPrincipalName,AccountEnabled,OnPremisesSyncEnabled
Get-MgUserLicenseDetail -UserId $upn | Select-Object SkuPartNumber,ServicePlans

# Nur in Hybrid-AD mit installiertem RSAT und Leserechten:
Import-Module ActiveDirectory
Get-ADUser -Identity 'mseidel' -Properties Enabled,UserPrincipalName |
  Select-Object SamAccountName,Enabled,UserPrincipalName
```

Diese Befehle prüfen **nur Zustände**. Tokens, Klartextkennwörter, Session-Cookies, Recovery-Schlüssel und private Daten nicht exportieren oder ins Ticket kopieren.

## 9. Nachweis, Restzugänge und Eskalationsmatrix

| Prüfergebnis | Bewertung | Nächste Aufgabe |
|---|---|---|
| Konto gesperrt, AD/Entra inkonsistent | Hybrid-Sync / Scope prüfen | Identity-Team |
| Entra gesperrt, SaaS-Sitzung aktiv | App-eigene Session, nicht erledigt | App/Security |
| VPN verbunden trotz Sperrung | Gateway-Sitzung prüfen | Network/Security |
| Shared-Mailbox-Erhalt unklar | Lizenz/Anker/Compliance STOP | Exchange/Legal |
| Intune-Wipe ausstehend | Noch kein Erfolgsnachweis | Endpoint/Asset |
| Lizenz geplant, OneDrive-Daten offen | Kein Entzug vor Datenentscheidung | Data Owner/Compliance |
| Zugriff auf alle relevanten Systeme geprüft | Maßnahmen und Nachweise korrelieren | Ticket Owner |

**Sperrwirkung nachweisen:** Accountstatus/Audit-Eintrag, Sicherheitsprotokolle und vorgesehene App-/VPN-Statusmeldungen prüfen. Kein Test mittels fremder Anmeldedaten; autorisierter Negativtest nur über zulässiges Verfahren. Rest-Risiko wegen Token-/Sessionlaufzeit transparent vermerken.

## 10. Muster-Ticketkommentar und Abschlussbedingungen

> **Fiktiver Ticketkommentar:** „Offboarding `HR-OFF-1050` zum genehmigten Zeitpunkt `[UTC/Lokalzeit]` eingeleitet. Benutzerobjekt `[UPN/Objekt-ID pseudonymisiert]` über Quellsystem `[AD DS/Entra]` zugeordnet. Sperrstatus `[Ergebnis/Zeit]` geprüft; Sitzungssperrung `[Aktion/Ergebnis]`; VPN/SaaS/Fachzugänge `[Team, Status]`; Geräte `[Inventar, Rückgabe oder Remoteaktion/Status]`. Mail-/OneDrive-/Projektübertragung: `[Anordnung, Owner, Freigabe/Frist]`. Lizenz-/Kontobereinigung: `[separate Freigabe oder ausstehend]`. Nachweise: `[Audit-Referenzen, Zeiten, offene Risiken]`. Keine Zugangsdaten oder privaten Inhalte im Ticket.“

**Abschluss:** Nur wenn die **genehmigte Sicherheitssperre** mit geeignetem Nachweis vollzogen und Restzugänge konkret zugeordnet sind. Daten-/Lizenz-/Löschvorgänge können separate Folgeaufträge mit Verantwortlichen und Fristen erfordern. „Alles deaktiviert“ nur dann behaupten, wenn die betroffenen Systeme tatsächlich geprüft wurden.

**Herstellerquellen:** [Q1]–[Q14] im Lernartikel und der README.  
**Validierung:** Recherchiert und dokumentiert; **keine reale Durchführung, kein praktischer Endtest**.
