# RB-011 – Praxis-Runbook: VPN-Verbindung schlägt fehl

**Zweck:** Kompakte L1-/L2-Arbeitsanweisung · **Version 1.0 (08.11.2026)**  
**Status:** Fachlich recherchiert, **nicht praktisch validiert**. Alle Beispielnamen und -adressen sind fiktiv.

## 1. Ticketaufnahme (L1)

- [ ] Benutzer, Client, Standort, betroffener VPN-Client, Zeitpunkt und genaue Fehlermeldung aufnehmen.
- [ ] Welche der drei Situationen? **A** kein Tunnel, **B** Tunnel verbunden, Firmenressourcen nicht erreichbar, **C** nur einzelne Anwendung betroffen.
- [ ] Funktioniert Internet **ohne** VPN? Sind mehrere Benutzer betroffen?
- [ ] Wurde zuletzt ein Kennwort, Zertifikat, VPN-Profil, Netzwerk oder Gerät geändert?
- [ ] Wie kann remote geholfen werden, ohne die aktive Verbindung zu unterbrechen?
- [ ] **Nicht** ungeprüft Profile löschen, Firewall/Zertifikatsprüfung abschalten oder Split-Tunnel-Richtlinien ändern.

## 2. Schnellentscheidung

| Beobachtung | Erste Diagnose |
|---|---|
| Kein Internet schon vor dem VPN-Aufbau | RB-009/RB-010: WLAN/LAN, IP, DNS, Gateway |
| VPN-Profil nicht vorhanden/falsch | Sollprofil und Clienttyp überprüfen |
| Fehler 691 / Authentifizierung | Benutzerkonto, MFA und Richtlinie, keine endlosen Loginversuche |
| Fehler 809 / Tunnel wird nicht aufgebaut | Erreichbarkeit des Gateways, Firewall/NAT, VPN-Protokoll und Transport |
| Fehler 812 / Richtlinie verweigert | NPS/RAS-Authentifizierung und Freigaberegeln (L2) |
| VPN verbunden, interne IP unerreichbar | VPN-IP, Routen, Zielsystem-/Firewallpfad |
| Interne IP erreichbar, interner Name nicht | Firmen-DNS/NRPT/Suffix und Auflösungswege |
| Nur ein bestimmter Dienst nicht erreichbar | Port, Server, Proxy, Anwendung und Berechtigung |

## 3. Lesende Clientdiagnose

**Ausführungsort:** Betroffener Windows-11-Client in PowerShell; ggf. mit Benutzerunterstützung. Die VPN-Cmdlets gelten für **Windows-integrierte Profile**.

```powershell
# Netzwerkadapter anzeigen.
Get-NetAdapter | Select-Object Name, Status, LinkSpeed

# IP-Konfiguration anzeigen.
Get-NetIPConfiguration

# Windows-VPN-Profile des Benutzers einschließlich Server und Status anzeigen.
Get-VpnConnection |
    Select-Object Name, ServerAddress, TunnelType, ConnectionStatus, SplitTunneling

# Computerweit eingerichtete Windows-VPN-Profile anzeigen.
Get-VpnConnection -AllUserConnection |
    Select-Object Name, ServerAddress, TunnelType, ConnectionStatus, SplitTunneling

# Die konfigurierte VPN-Gegenstelle auflösen.
Resolve-DnsName -Name 'vpn.firma.example'
```

**Auswertung:** Ein Drittanbieter-VPN kann von `Get-VpnConnection` **nicht** erfasst werden. Name oder IP des Gateways nicht mit einem beliebigen öffentlichen Ziel verwechseln.

## 4. Fehlgeschlagene Verbindung: Ereignis und Transport

```powershell
# Sucht im Windows-Anwendungsprotokoll nach typischen RasClient-Fehlern.
# Manche Clients schreiben in eigene Logdateien statt in dieses Protokoll.
Get-WinEvent -FilterHashtable @{
    LogName   = 'Application'           # Ereignisprotokoll
    Id        = 20227                   # Beispiel: RasClient-VPN-Fehler
    StartTime = (Get-Date).AddHours(-24) # Letzte 24 Stunden
} -ErrorAction SilentlyContinue |
    Select-Object -First 15 TimeCreated, ProviderName, Message
```

- [ ] Fehlermeldung/Fehlercode und Uhrzeit mit dem richtigen Profil abgleichen.
- [ ] Bei IKEv2 die **UDP**-Transportwege 500/4500 durch zuständiges Netzwerkteam prüfen; `Test-NetConnection -Port` prüft **TCP**, nicht UDP.
- [ ] Bei SSTP ggf. TCP 443 als einen Transporttest betrachten, nicht als Erfolgsbeweis für die VPN-Anmeldung.
- [ ] Bei Zertifikats-/MFA-/Richtlinienfehlern die verantwortlichen Administratoren einbeziehen.

## 5. VPN verbunden: Firmenzugriff prüfen

```powershell
# IP-Konfiguration und Routingtabelle nach dem VPN-Aufbau ansehen.
Get-NetIPConfiguration

# IPv4-Routen mit Zielnetz, Ausgangsschnittstelle und Next Hop.
Get-NetRoute -AddressFamily IPv4 |
    Select-Object DestinationPrefix, InterfaceAlias, NextHop, RouteMetric

# Interne Namensauflösung testen.
Resolve-DnsName -Name 'intranet.firma.example'

# Effektive Namensauflösungsrichtlinien anzeigen (wenn konfiguriert).
Get-DnsClientNrptPolicy -Effective

# Tatsächlichen internen TCP-Dienst testen (Beispiel HTTPS: 443).
Test-NetConnection -ComputerName 'intranet.firma.example' -Port 443
```

**Auswertung:** Erfolgreiche Namensauflösung ersetzt weder passende Route noch funktionierende Anwendung. Ein erfolgreicher TCP-Porttest beweist keine erfolgreiche Anmeldung in der Anwendung.

## 6. Änderung nur nach Befund und Freigabe

- [ ] Profil-/Serveradresse gemäß freigegebener Sollkonfiguration korrigieren.
- [ ] Konto/MFA/Zertifikat mit zuständigem Identitäts- oder PKI-Team klären.
- [ ] Fehlende Firmenroute, DNS-Regel, Firewall- oder VPN-Gateway-Konfiguration nur nach Zuständigkeit korrigieren.
- [ ] Vor verändernden Maßnahmen Diagnosedaten, Remotezugangsrisiko und Rückfallweg dokumentieren.
- [ ] Keine generelle Deaktivierung von Sicherheitsprüfungen als „Test“.

## 7. Funktionsprüfung und Ticketabschluss

- [ ] Vorgesehenes VPN-Profil baut erfolgreich Verbindung auf.
- [ ] Freigegebene interne Testressource über die richtige Route erreichbar.
- [ ] Interne Namensauflösung und konkrete Anwendung funktionieren.
- [ ] Internetverhalten entspricht der Split-/Full-Tunnel-Richtlinie.
- [ ] Ticket dokumentiert Ursache, Maßnahme, Freigabe und Ergebnis.

## 8. Eskalation an L2

Erforderlich bei **mehreren betroffenen Benutzern, VPN-Gateway-/Firewall-/NPS-/PKI-Problemen, unklarer Routing- oder DNS-Richtlinie, wiederholten Authentifizierungsfehlern, Fehler 809/812/13801/13806** oder fehlender Änderungsberechtigung. Mitgeben: Fehlercode, Zeitstempel, Client- und VPN-Version, anonymisierte IP-/Routen-/DNS-Diagnose, bereits durchgeführte Tests und Änderungen. **Keine Kennwörter, Token oder privaten Schlüssel im Ticket speichern.**

**Vertiefung:** [Ausführlicher Lernartikel](RB-011_Lernartikel.md) mit Begriffserklärungen, Quellen, Entscheidungsbaum und fiktivem Muster-Ticket.
