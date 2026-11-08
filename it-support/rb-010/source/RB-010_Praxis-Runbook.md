# RB-010 – Praxis-Runbook: Keine Netzwerk- oder Internetverbindung

**Zweck:** Kompakte L1-/L2-Arbeitsanweisung · **Version 1.0 (08.11.2026)**  
**Status:** Recherchiert; nicht praktisch validiert. Adressen und Namen im Beispiel sind fiktiv.

## 1. Ticketaufnahme und Scope (L1)

- [ ] Benutzer, Client, Standort, Zeitpunkt und exakte Fehlermeldung dokumentieren.
- [ ] Geht LAN/WLAN nicht, ist „Kein Internet“ angezeigt, oder ist nur ein Dienst betroffen?
- [ ] Sind mehrere Geräte/Standorte betroffen? Änderungen an VPN, Netzwerk, Updates bekannt?
- [ ] Welcher Diagnosezugang steht zur Verfügung? Läuft eine Remotesitzung über das betroffene Interface?
- [ ] **Keine** unkoordinierten Resets, Firewall-Abschaltungen, DNS-Änderungen oder DHCP-Erneuerungen durchführen.

## 2. Diagnoseebene bestimmen

| Beobachtung | Zuerst prüfen |
|---|---|
| Kein Adapter-Link | Adapter, Kabel, WLAN, Switchport |
| IPv4 `169.254.x.x` und DHCP erwartet | DHCP-Bezug, VLAN, Link, DHCP-Relay/-Server |
| IP plausibel, Gateway fraglich | Netzmaske, Routen, Zielzugriff |
| Direkte IP-Verbindung funktioniert, Name nicht | DNS-Server, Zonen/Einträge, VPN-DNS |
| Name löst auf, Zielport nicht erreichbar | Dienst, Route, Firewall, Proxy |
| „Kein Internet“, aber konkrete Ziele erreichbar | NCSI-/Proxy-Prüfungen gesondert |
| Mehrere Benutzer betroffen | Zentrale Infrastruktur und L2 informieren |

## 3. Lesende Clientdiagnose

**Ausführungsort:** Betroffener Windows-11-Rechner, PowerShell. Vorher Adapter und verwendete Remoteverbindung feststellen.

```powershell
# Netzwerkadapter und Link-Status ausgeben.
Get-NetAdapter |
    Select-Object Name, Status, InterfaceDescription, LinkSpeed

# IP-Adressen, Gateway und DNS-Server anzeigen.
Get-NetIPConfiguration

# DHCP-/Adapterdetails anzeigen; Windows-Programm in PowerShell.
ipconfig /all

# IPv4-Routingtabelle anzeigen; Windows-Programm in PowerShell.
route print -4

# Standardrouten gezielt auslesen.
Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' |
    Select-Object DestinationPrefix, NextHop, InterfaceAlias, RouteMetric
```

**Auswertung:** Bei DHCP-erwarteter Adresse `169.254.x.x` DHCP-Pfad prüfen. Mehrere Interfaces können unterschiedliche Routen/DNS-Werte verwenden. Eine hohe `LinkSpeed` ist kein Internet-Speedtest.

## 4. Erreichbarkeit von Gateway, DNS und Dienst

**Die Adressen müssen aus der tatsächlichen Sollkonfiguration übernommen werden.**

```powershell
# Beispielhaftes Gateway per ICMP testen; ICMP kann blockiert sein.
ping 192.168.50.1

# Namensauflösung über die eingerichtete DNS-Konfiguration testen.
Resolve-DnsName -Name 'www.microsoft.com'

# Einen dokumentierten internen DNS-Server direkt befragen.
Resolve-DnsName -Name 'intranet.firma.example' -Server '192.168.50.10'

# TCP-Verbindung zu einem konkreten internen HTTPS-Dienst testen.
Test-NetConnection -ComputerName '192.168.50.20' -Port 443

# Browser-/Webdienst-Auflösung und TCP-Verbindung getrennt beurteilen.
Test-NetConnection -ComputerName 'www.microsoft.com' -Port 443
```

**Interpretation:** Erfolgreicher TCP-Porttest beweist noch keine funktionierende Anwendung. Erfolgloses Ping beweist keinen generellen Ausfall. Bei Proxy-/VPN-Netzen kann direkter TCP-Zugriff von Browserzugriff abweichen.

## 5. Unternehmensumgebung (L1/L2)

- [ ] Soll-DNS und DNS-Suffix prüfen; in AD-Umgebungen **keinen** öffentlichen Resolver blind eintragen.
- [ ] DHCP-Clientstatus, Lease, VLAN, DHCP-Server/Relay und Scope untersuchen.
- [ ] VPN-Verbindung und Routen zum konkreten internen oder externen Ziel vergleichen.
- [ ] Proxy/PAC für die betroffene Anwendung berücksichtigen. `netsh winhttp show proxy` zeigt **nur die WinHTTP-Proxykonfiguration**.
- [ ] Firewall- und Routingregeln nicht pauschal deaktivieren.
- [ ] Bei Windows-Meldung „Kein Internet“ ggf. NCSI prüfen; Zieltests bleiben entscheidend.

## 6. Änderung erst nach Befund und Freigabe

- [ ] Link-/Kabel-/Portproblem gezielt beheben.
- [ ] DHCP-Lease **nur bei begründeter Diagnose** kontrolliert erneuern; Remoteverbindung kann abbrechen.
- [ ] Falsche DNS-/Route-/VPN-/Proxykonfiguration gemäß Unternehmensstandard korrigieren.
- [ ] Gemeinsame Infrastrukturänderungen ausschließlich durch zuständige Administrationsstelle.
- [ ] Diagnosezustand vorher dokumentieren; gegebenenfalls Rückfallweg bereithalten.

## 7. Funktionsprüfung und Abschluss

- [ ] Netzwerkadapter verbunden; IP, Gateway, DNS und Route plausibel.
- [ ] Benötigte Dienste mit Namen und vorgesehenem Protokoll/Port erreichbar.
- [ ] Tatsächliche Anwendung mit dem Benutzer erneut testen.
- [ ] Nebeneffekte für VPN/Firmennetz prüfen.
- [ ] Ursache, Befund, Maßnahme, Ergebnis, Uhrzeit und Freigabe im Ticket dokumentieren.

## 8. L2-Eskalation bei

Gemeinsamem Standortausfall, DHCP-/DNS-/Router-/Firewall-/VPN-Problemen außerhalb der L1-Berechtigung, widersprüchlichen Messwerten oder Störungen, die nicht reproduzierbar eingegrenzt werden können. Mitliefern: Umfang, Zeit, betroffener Adapter, anonymisierte IP-/Routing-/DNS-Daten, konkrete Tests und bereits ausgeführte Änderungen.

**Quelle/Vertiefung:** [Ausführlicher RB-010-Lernartikel](RB-010_Lernartikel.md) einschließlich Microsoft-Dokumentation und Entscheidungsbaum.
