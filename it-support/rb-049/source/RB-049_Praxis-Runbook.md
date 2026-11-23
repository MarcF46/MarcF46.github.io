# RB-049 – Praxis-Runbook: Onboarding Arbeitsplatz und Zugänge (L1/L2)

**Stand:** 23.11.2026 · **Version 1.0** · **Status:** Recherchierte Arbeitsanweisung, **nicht praktisch validiert**. Keine Benutzer- oder Gerätekonfiguration wurde produktiv verändert.

## 1. Eingangsticket und Scope

- [ ] HR-/Fachauftrag und Eintrittstermin verifiziert; HR-Referenz und Genehmigung im Ticket.
- [ ] Eindeutige Person/Benutzerkennung, Rolle, Vorgesetzter, Standort und Ansprechpartner erfasst.
- [ ] Soll: Benutzerkonto, Fach-/M365-Gruppen, Lizenzen, MFA, Gerät, Teams, Exchange, OneDrive, Fachapp, Netzfreigaben klar definiert.
- [ ] Verantwortliche für Zugriffsgenehmigung und Assetübergabe benannt; unklare Forderungen zurückgestellt.

**STOP:** Keine Konto-/Rechtevergabe ohne verifizierten Auftrag; keine Kennwörter/MFA-Codes in Tickets.

## 2. Quellsystem und Identität prüfen

**Cloud-only oder Hybrid?** Bei lokalem AD als maßgeblicher Quelle das Konto dort gemäß Prozess anlegen/prüfen; keine parallelen Doppelkonten in der Cloud erzeugen. Eindeutigen UPN, Anzeigenamen, Status, Nutzungsstandort und ggf. Manager abgleichen. Existierendes Konto/Wiederanstellung prüfen.

**Lesender Nachweis (mit Berechtigung):** Entra-Benutzerübersicht, On-prem-Sync-Status, AD-Benutzerobjekt und ggf. Synchronisationsprotokoll.

## 3. Gruppen und Ressourcenrechte prüfen

- [ ] Sollrollenmatrix des Fachbereichs mit Gruppen/Anwendungsrollen verknüpft.
- [ ] Nur **genehmigte** Gruppen (Entra, AD, M365) und App-spezifische Berechtigungen.
- [ ] Keine Übernahme aller Rechte eines Vergleichskollegen.
- [ ] Keine Adminrollen ohne Sonderfreigabe; effektive Zugriffe an Zielressource später testen.

**L1:** Auftrag/Soll vergleichen, Vorgänge anberechtigte Stellen routen. **L2:** Gruppen-/ACL-/Rollenstatus im genehmigten Zuständigkeitsbereich prüfen.

## 4. Lizenzen und Dienste nachweisen

- [ ] Richtige SKU und Nutzungsstandort, verfügbares Kontingent und zugewiesene Servicepläne.
- [ ] Direkte oder gruppenbasierte Zuweisung und deren **Status/Fehler** geprüft.
- [ ] Exchange-Postfach, Teams- und weitere tatsächlich benötigte Dienste erschienen/nutzbar.
- [ ] Bei Verzögerung Provisionierung/Service Health prüfen; nicht blind Lizenz entziehen/neu zuweisen.

**Achtung:** Lizenz-Status im Portal ist noch kein bestandener Mail-/Teams-Funktionstest.

## 5. MFA und sichere Erstanmeldung vorbereiten

- [ ] Vorgesehene Authentifizierungsmethode und CA-Richtlinien geklärt.
- [ ] Sichere Übergabe mit verifizierter Identität vereinbart.
- [ ] Bei Freigabe Temporary Access Pass zeitlich begrenzt zur Registrierung zugelassener Methoden; niemals im Ticket dokumentieren.
- [ ] Registrierung gemeinsam mit **Benutzer**, nicht stellvertretend mit Support-Gerät/MFA.
- [ ] Bei Anmeldung gesperrt: Entra-Sign-in-Log, Fehlercode, CA-Entscheidung prüfen; Security einschalten.

## 6. Gerät inventarisieren und verwalten

- [ ] Richtiges Gerät, Seriennummer, Zubehör, Standort und Übergabe protokolliert.
- [ ] Windows bereitgestellt, Gerät registriert/MDM-eingeschrieben (wenn vorgesehen), letzter Intune-Check-in plausibel.
- [ ] Compliance und Sicherheitsstatus (Verschlüsselung, Recovery-Schlüssel-Hinterlegung gemäß Policy, Schutzsoftware) bestätigt.
- [ ] Unternehmensanwendungen und ggf. VPN, Drucker, Peripherie eingerichtet.
- [ ] Kein Reset, Reenrollment oder Policy-Bypass auf Verdacht (siehe RB-045/RB-046).

## 7. Lesende Stichproben (nur berechtigte Admins)

```powershell
# Graph-Modul und Leserechte erforderlich. Keine geheimen Daten ins Ticket.
Connect-MgGraph -Scopes 'User.Read.All','Directory.Read.All'
$upn = 'jana.weber@firma.example'  # fiktiv
Get-MgUser -UserId $upn -Property 'DisplayName,UserPrincipalName,AccountEnabled,UsageLocation,OnPremisesSyncEnabled' |
  Select-Object DisplayName,UserPrincipalName,AccountEnabled,UsageLocation,OnPremisesSyncEnabled
Get-MgUserLicenseDetail -UserId $upn | Select-Object SkuPartNumber,ServicePlans

# Am Windows-Gerät, keine Änderungen:
dsregcmd /status
Get-BitLockerVolume -MountPoint 'C:' | Select-Object MountPoint,ProtectionStatus
```

**Nachweisgrenze:** AD/Entra-Abfragen sind Statushinweise; sie ersetzen **keine bestätigten Zugriffsrechte am Fachsystem** und keinen Anwenderfunktionstest.

## 8. Entscheidungs-/Eskalationsmatrix

| Befund | Prüfpfad | Zuständig |
|---|---|---|
| Auftrag unvollständig / nicht genehmigt | STOP, HR-/Fachfreigabe einholen | HR/Teamleitung |
| Konto fehlt / Dublette / Hybrid-Sync | Quellsystem, Identitätsobjekt, Syncstatus | Identity/AD |
| Mail fehlt trotz Benutzer | SKU/Serviceplan/Provisionierung/Exchange | Lizenz-/Exchange-Team |
| MFA scheitert / CA blockiert | Methode, User, Gerätezustand, Sign-in-Logs | Identity/Security |
| Laptop nicht bereit/compliant | Enrollment/Intune-Check-in/Policies/Apps | Endpoint/Intune |
| Fachapp verweigert Zugriff | Genehmigte Rolle, Gruppe, App-ACL, Token | App-Owner/L2 |
| Nur ein Teilschritt offen | Teilstatus und Owner/Termin dokumentieren, nicht vollständig abschließen | Ticketverantwortlicher |

## 9. Abnahme: End-to-End-Funktionstest mit Anwender

- [ ] Benutzer meldet sich selbst am übergebenen Gerät an; MFA/CA erfolgreich.
- [ ] Outlook: Testmail senden/empfangen; Teams: Anmeldung und erforderlicher Teamzugriff.
- [ ] OneDrive/SharePoint: genehmigte Testdatei öffnen; Netzfreigabe bei Bedarf.
- [ ] Fachapp: erlaubte Aufgabe ausführen; unberechtigte Bereiche bleiben geschlossen.
- [ ] Erforderliche Peripherie/VPN/Drucker getestet; Ergebnis und Abweichungen festgehalten.
- [ ] Gerät, Zubehör und Erstinformationen sicher übergeben; Empfang bestätigt.

**Keine** echte Berechtigung durch Admin-Impersonation oder Abfrage des MFA-Codes ersetzen. Wenn Nutzer beim Test nicht anwesend ist, „ausstehender Anwender-Endtest“ dokumentieren.

## 10. Muster-Ticketkommentar, Abschluss und Validierungsstatus

> **Fiktiver Ticketkommentar:** „Onboarding auf Basis HR-ONB-1049 durchgeführt/vorbereitet. Quellsystem und Konto eindeutig verifiziert; freigegebene Rollen und Gruppen abgeglichen; benötigte M365-Lizenzen/Servicepläne geprüft; MFA-Ersteinrichtung begleitet. Gerät LT-049 inventarisiert, Intune-/Compliance-Status kontrolliert und benötigte Anwendungen bereitgestellt. End-to-End-Prüfung: Windows [Ergebnis], Mail [Ergebnis], Teams [Ergebnis], Dateiablage [Ergebnis], Fachapp [Ergebnis]. Offene Punkte [Status/Owner/Termin]. Übergabe durch [berechtigte Person] bestätigt. Keine Zugangsdaten und keine übermäßigen Rechte im Ticket.“

**Abschluss nur dann**, wenn genehmigter Sollzustand und Endtest erfüllt sind. Sonst Teilstatus offen lassen und Zieltermin/Verantwortlichen festhalten. Erneute Tests nach den dokumentierten Nacharbeiten.

**Sicherheitsregel:** Keine geheimen Erstzugangsdaten, kein TAP, keine Recovery-Schlüssel, keine unnötigen personenbezogenen Daten ins Ticket; keine Administratorrechte ohne separate Freigabe.

**Quellen:** siehe [Q1]–[Q15] im Lernartikel und in der README.  
**Validierung:** Recherchiert; **praktische Durchführung und Fehlerreproduktion ausstehend**. Keine produktiven Änderungen erfolgt.
