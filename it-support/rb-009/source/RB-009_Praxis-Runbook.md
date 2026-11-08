# RB-009 – Praxis-Runbook: WLAN-Verbindung funktioniert nicht

**Zweck:** Kompakte Support-Checkliste (L1/L2) · **Stand:** 08.11.2026 · **Version:** 1.0  
**Status:** Fachlich recherchiert; praktisch nicht validiert. Beispielnamen/IP-Adressen sind fiktiv.

## 1. Ticket aufnehmen (L1)

- [ ] Client, Benutzer, Standort, betroffene SSID (*Service Set Identifier*, WLAN-Name) und Zeitpunkt notieren.
- [ ] Symptom festhalten: WLAN fehlt / nicht sichtbar / Anmeldung scheitert / verbunden ohne IP / verbunden ohne Internet / wiederkehrender Abbruch.
- [ ] Exakte Windows-Meldung, Update/Standort-/Profiländerung, aktuelle Verbindung und Reichweite erfragen.
- [ ] Prüfen: Einzelgerät, mehrere Benutzer am selben AP (*Access Point*, WLAN-Funkstation) oder ganzer Standort?
- [ ] Fernzugriff vorhanden? Falls die Verbindung über WLAN läuft, keine risikoreichen Netzwerkänderungen aus der Fernwartung heraus durchführen.
- [ ] Freigaben, Wartungsfenster und Datenschutzregeln klären.

## 2. Problem einer Ebene zuordnen

| Befund | Nächster Diagnosezweig |
|---|---|
| Kein Adapter / kein WLAN-Schalter | Adapter, Treiber, Funkstatus und WLAN-Dienst (`WlanSvc`) |
| SSID wird nicht angezeigt | AP, Funkabdeckung, Frequenzband, Netzprofil/Policy |
| SSID sichtbar, Authentifizierung scheitert | WLAN-Profil, WPA2/WPA3, bei Unternehmen 802.1X/EAP/Zertifikat/NPS |
| Verbunden, IPv4 `169.254.x.x` | DHCP (*Dynamic Host Configuration Protocol*), VLAN, AP-Uplink |
| IP plausibel, interne Dienste nicht erreichbar | DNS, Standardgateway, Routing, Firewall, VPN, Dienst |
| Nur zeitweise, standortabhängig | BSSID, Signal, Kanal, Roaming, AP/Controller |

**Merksatz:** WLAN-Funkverbindung ≠ funktionierender IP-/DNS-/Internet-Zugang.

## 3. Lesende Diagnose am Windows-Client

**Ausführungsort:** Betroffener Windows-11-Client, ggf. mit Administratorrechten für die Ereignis-/Berichtsdaten.

```powershell
# Listet Netzwerkadapter und deren Zustand auf.
Get-NetAdapter |
    Select-Object Name, Status, InterfaceDescription, LinkSpeed

# Prüft den Dienst zur Verwaltung von WLAN-Profilen/-Verbindungen.
Get-Service -Name 'WlanSvc' |
    Select-Object Name, Status, StartType

# Zeigt WLAN-Verbindungsstatus, SSID, BSSID und Signal.
netsh wlan show interfaces

# Listet sichtbare Netze und einzelne Access Points (BSSID/Kanal).
netsh wlan show networks mode=bssid

# Zeigt die Netzwerkkonfiguration einschließlich DHCP/DNS.
ipconfig /all

# Zeigt IP-Adressen, Gateways und DNS-Server in PowerShell.
Get-NetIPConfiguration
```

**Interpretation:** SSID nicht sichtbar → Funk/AP/Profil prüfen. Authentifizierung fehlgeschlagen → WLAN-Logs/EAP prüfen. `169.254.x.x` bei erwartetem DHCP → DHCP-Weg überprüfen, nicht blind feste IP setzen.

## 4. WLAN-Ereignisse und Verbindungsverlauf

**Ausführungsort:** Betroffener Client; für den Bericht eine erhöhte PowerShell/Eingabeaufforderung.

```powershell
# Schreibt einen WLAN-HTML-Bericht auf die lokale Festplatte.
# Der Speicherort erscheint nach Ausführung in der Konsole.
netsh wlan show wlanreport

# Name des WLAN-Ereignisprotokolls festlegen.
$log = 'Microsoft-Windows-WLAN-AutoConfig/Operational'

# Ereignisse aus den letzten zwei Stunden anzeigen.
Get-WinEvent -FilterHashtable @{
    LogName   = $log
    StartTime = (Get-Date).AddHours(-2)
} -MaxEvents 20 |
    Select-Object TimeCreated, Id, Message
```

**Prüfen:** Fehlerversuchszeit, BSSID, WLAN-Verbindungs-/Trennungsgrund. Der HTML-Bericht fasst unter anderem Ereignisse der letzten **drei Tage** zusammen. Er enthält potenziell vertrauliche Netzwerkinformationen: **vor Weitergabe und Veröffentlichung bereinigen**.

## 5. IP-, DNS- und Dienstzugriff prüfen

**Ausführungsort:** Betroffener Client; nur passende Unternehmensziele verwenden.

```powershell
# Namensauflösung für ein tatsächlich bekanntes internes Ziel.
# Den Platzhalternamen in der Praxis ersetzen.
Resolve-DnsName 'intranet.firma.example'

# TCP-Verbindung zu einem internen HTTPS-Ziel prüfen.
# 192.0.2.20 ist eine reservierte Dokumentationsadresse.
# Für reale Tests die echte Zieladresse einsetzen.
Test-NetConnection -ComputerName '192.0.2.20' -Port 443
```

**Auswertung:** Kein Name auflösbar → DNS prüfen. Name auflösbar, Port nicht erreichbar → Ziel, Routing und Firewall prüfen. Ping alleine beweist wenig, da ICMP blockiert sein kann.

## 6. Besonderheit Firmen-WLAN mit 802.1X (L2)

- [ ] Authentifizierungsmethode im verwalteten WLAN-Profil feststellen.
- [ ] EAP (*Extensible Authentication Protocol*)-/Zertifikatsstatus und vorgesehenen Servernamen prüfen.
- [ ] Keine Zertifikats- oder Serveridentitätsprüfung deaktivieren.
- [ ] Bei Microsoft NPS (*Network Policy Server*) entsprechende Security-Events vergleichen: **6272** Zugang gewährt, **6273** Zugang verweigert; Reason Code lesen.
- [ ] AP/Controller, RADIUS (*Remote Authentication Dial-In User Service*), Netzwerkpolicy, VLAN und DHCP aufeinander abstimmen.
- [ ] Benutzer-/Geräte-Zertifikate nicht eigenmächtig erneuern oder exportieren.

## 7. Verändernde Maßnahmen ausschließlich nach Befund

- [ ] Funkadapter/Flugmodus nur nach Zustimmung prüfen und gegebenenfalls korrigieren.
- [ ] Erkennbar fehlerhafte WLAN-Profile nur über freigegebenen GPO-/MDM-Prozess (Gruppenrichtlinien/Geräteverwaltung) neu bereitstellen.
- [ ] Treiberwechsel oder Netzwerkreset nicht als ersten Schritt; Diagnose vorher sichern.
- [ ] DHCP-/DNS-/VLAN-/AP-Problem zentral mit zuständigem Team beheben lassen.
- [ ] AP- oder WLAN-Controller-Neustarts nur geplant: Mehrbenutzer-Auswirkungen berücksichtigen.
- [ ] Keine „Sicherheits-Workarounds“ wie das Abschalten der Serverzertifikatsprüfung.

## 8. Funktionskontrolle

- [ ] Richtige SSID/BSSID und Verbindungsstatus geprüft.
- [ ] Bei Enterprise-WLAN Authentifizierung und Richtlinien korrekt.
- [ ] Passende IP-Konfiguration und erwartete DNS-/Gateway-Werte.
- [ ] Gewünschte Unternehmensanwendung erreichbar.
- [ ] Bei Roaming-/Abbruchproblem mehrminütige oder ortsbezogene Nachprüfung.
- [ ] Änderungen, Ursache, Ergebnisse und eventuelle Restunsicherheit im Ticket dokumentiert.

## 9. Eskalation L1 → L2

Bei mehreren betroffenen Nutzern, AP-/Controller-/NPS-/RADIUS-/802.1X-/Zertifikats-/VLAN-/DHCP-/Firewall-/Routing-Problemen, wiederkehrenden Verbindungsabbrüchen oder fehlenden Berechtigungen eskalieren.

**Mitgeben:** Client, SSID/BSSID (nur intern), Gebäude/Etage, Zeitpunkt, Fehlermeldung, IP-Konfiguration, anonymisierte WLAN-Berichte/Logs, Gegenprobe mit anderem Client, bisherige Maßnahmen, Auswirkung.

## 10. Fiktiver Ticketkommentar

**INC-009 – WLAN sichtbar, keine Unternehmens-IP.** Ein Client betroffen. WLAN-Adapter aktiv, Funknetz verbunden, IPv4-Adresse `169.254.x.x`. DHCP-Zuweisung fehlgeschlagen; genaue Ursache noch offen. Diagnosebericht gesichert, kein Profil gelöscht; zur Prüfung von WLAN-VLAN, DHCP und AP-Uplink an Netzwerkteam eskaliert. **Status: Eskaliert, nicht gelöst.**

## 11. Herstellerquellen

- [Microsoft Learn – Erweiterte WLAN-Diagnose](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting)
- [Microsoft Support – WLAN-Bericht](https://support.microsoft.com/de-de/windows/experience/connectivity-networking/analyze-the-wireless-network-report)
- [Microsoft Learn – netsh wlan](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/netsh-wlan)
- [Microsoft Learn – 802.1X-Diagnose](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/802-1x-authentication-issues-troubleshooting)
- [Microsoft Learn – NPS-Diagnose](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-network-policy-server)

**Details, Grundlagen und Beispielinterpretationen:** [RB-009 Lernartikel](RB-009_Lernartikel.md). **Praktischer Test:** Noch nicht durchgeführt.
