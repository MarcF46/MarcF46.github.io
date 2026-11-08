# RB-015 – Microsoft Teams funktioniert nicht | Praxis-Runbook

**Level:** L1/L2 · **Status:** Recherchierte Arbeitsanweisung, nicht praktisch validiert · **Version:** 1.0 (08.11.2026)

> **Kurzprinzip:** Umfang erfassen → Teams im Web vergleichen → Dienst/Identität/Client/Medien prüfen → gezielt beheben → mit Benutzer testen.

## 1. Ticketaufnahme

- [ ] Benutzer, Gerät, Standort, Uhrzeit, Screenshot/exakten Fehlercode erfassen.
- [ ] Betroffene Funktion: **Start / Anmeldung / Chat / Kanal / Audio / Video / Dateien**.
- [ ] Ein Benutzer, mehrere am selben Standort oder unternehmensweit?
- [ ] Seit wann? Änderungen an Passwort, MFA, Gerät, Updates oder Netz?
- [ ] **Teams im Web** mit gleichem Geschäftskonto zum Vergleich getestet?

## 2. Sofortige Eingrenzung

| Befund | Nächste Prüfung |
|---|---|
| Nur Desktop-App betroffen | Teams-Client, Version, lokales App-Profil, Supportprotokolle |
| Web und Desktop betroffen | Konto/Entra-Anmeldeprotokolle, Lizenz, Dienststatus, Netzwerk |
| Viele Benutzer betroffen | Microsoft-365-Service-Health, zentrale Netzwerk-/Richtlinienänderungen |
| Nur Meeting-Audio/-Video | Teams-Geräte, Windows-Berechtigungen, Netzwerkqualität, Call Analytics |

**Keine vorschnelle Neuinstallation oder Cache-Löschung.** Microsoft weist ausdrücklich darauf hin, dass Cache-Löschung für einige Chat-/Kanalprobleme ungeeignet ist und Diagnoseprotokolle entfernen kann.

## 3. Lesende Windows-Diagnose

**Ausführungsort:** Betroffener Client im Benutzerkontext oder erlaubte Admin-Fernwartung. 

```powershell
# Zeigt Teams-Prozesse an, soweit sie vorhanden sind.
Get-Process -Name 'ms-teams','msteams' -ErrorAction SilentlyContinue |
    # Ausgabe auf wenige Eigenschaften beschränken.
    Select-Object ProcessName, Id, StartTime

# Prüft das neue Teams-App-Paket im aktuellen Benutzerkontext.
Get-AppxPackage -Name 'MSTeams' |
    # Version und Installationsort anzeigen.
    Select-Object Name, Version, InstallLocation

# Prüft die DNS-Auflösung eines Microsoft-Teams-Webnamens.
Resolve-DnsName -Name 'teams.microsoft.com'

# Testet TCP/443; beweist noch keine funktionierende Teams-Anmeldung.
Test-NetConnection -ComputerName 'teams.microsoft.com' -Port 443
```

## 4. Administratorprüfungen (nur mit Freigabe/Berechtigung)

- [ ] **Microsoft 365 Admin Center → Service health:** Ist ein relevanter Incident bekannt?
- [ ] **Microsoft Entra Admin Center → Sign-in logs:** Benutzer, Uhrzeit, Fehlercode, Korrelations-ID, Conditional Access.
- [ ] Teams Admin Center: Richtlinie, Teams-Berechtigung und bei Audio/Video **Call Analytics**.
- [ ] Lizenz, Accountstatus und ggf. Conditional-Access-Anforderungen prüfen.
- [ ] Bei mehreren Standorten: Proxy, Firewall, Endpunkte, DNS und Netzwerkqualität durch zuständiges Team prüfen.

## 5. Protokolle sichern

**Neues Teams unter Windows:** **Strg + Alt + Umschalt + 1** erfasst Teams-Supportdateien. Auf Datenschutz und UTC-Zeitstempel achten; Informationen nur über autorisierte Wege weitergeben.

[Microsoft – Teams-Protokolldateien](https://learn.microsoft.com/de-de/microsoftteams/log-files)

## 6. Befundabhängige Maßnahmen

| Befund | Maßnahme |
|---|---|
| Client hängt, Web geht | Teams vollständig beenden/neu starten, ggf. Update/Reparatur gemäß Unternehmensprozess |
| Fehler bleibt nur im neuen Teams | Protokolle sichern; bei begründetem Verdacht Reset der App-Einstellungen als bewusste Änderung |
| Conditional Access blockiert | Richtlinienbefund sichern und verantwortliches Identity-/Security-Team einbinden |
| Microsoft-365-Incident | Kommunikation und Eskalation statt lokaler „Reparatur“ |
| Falsches Mikrofon/Kamera | In Teams und Windows das richtige Gerät freigeben und auswählen |
| Schlechte Besprechungsqualität | Funknetz/Headset/Call Analytics/Standortpfad untersuchen |

**Nicht tun:** Sicherheitsrichtlinien pauschal deaktivieren, Benutzerkennwörter erfragen, blind Teams-Cache löschen oder fremde Sessions übernehmen.

## 7. Funktionsprüfung

- [ ] Ursprüngliche Fehlermeldung erscheint nicht mehr.
- [ ] Benutzer kann sich mit dem vorgesehenen Konto anmelden.
- [ ] Betroffene Funktion wurde **zusammen mit dem Benutzer** erfolgreich geprüft.
- [ ] Wenn Meetings betroffen: Testanruf/Besprechung für Audio und Video.
- [ ] Ticket enthält Ursache bzw. gesicherten Befund, Maßnahmen, Testergebnis und ggf. Eskalationsdaten.

## 8. Eskalation an L2

Wenn Authentifizierung/Richtlinien, zentrale Service-Probleme, Client-Bereitstellung oder Medienpfade nicht im L1-Rahmen gelöst werden können: exakten Fehlertext, Uhrzeit, betroffene Geräte/Standorte, Desktop-vs-Web-Befund, Anmeldeprotokoll-Korrelation und Supportdateien an berechtigtes Team übergeben.

### Ticketmuster (fiktiv)

**INC-015:** Desktop-Anmeldung fehlgeschlagen, Web funktioniert. Dienststatus ohne bekannten relevanten Ausfall; lokaler Teams-Client als wahrscheinlicher Problemort eingegrenzt. Teams-Supportprotokolle gesichert, genehmigte App-Reparatur durchgeführt; anschließender Test mit Benutzer erfolgreich. **Status:** gelöst (fiktives Beispiel).

## Technische Referenzen

- [Teams-Cache – Grenzen und Reset des neuen Clients](https://learn.microsoft.com/de-de/troubleshoot/microsoftteams/teams-administration/clear-teams-cache)
- [Teams-Protokolle sammeln](https://learn.microsoft.com/de-de/microsoftteams/log-files)
- [Teams-Anmeldefehler](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/teams-sign-in/resolve-sign-in-errors)
- [Conditional Access prüfen](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Teams-Anrufqualität](https://learn.microsoft.com/de-de/microsoftteams/monitor-call-quality-qos)

**Validierung:** Technisch recherchiert, in diesem Projekt noch nicht praktisch getestet.
