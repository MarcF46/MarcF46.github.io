# RB-039 – Dienst oder TCP-Port nicht erreichbar · Komplettpaket

**50 Tickets – 50 typische Supportfälle** · Ticket **039** · **L2** · **Version 1.0** · **22.11.2026**

**Status:** Quellenrecherche und Dokumentation abgeschlossen; **nicht praktisch validiert**, nicht auf der Website veröffentlicht.

## Inhalt des Komplettpakets: sechs Dateien

| Datei | Zweck |
|---|---|
| `RB-039_Lernartikel.md` | 15 Kapitel: TCP-Handshake, Dienst vs. Listener, Firewall/Bindadresse, A/B-Tests, Anwendungsschicht, zwei fiktive Fälle, Lernfragen |
| `RB-039_Praxis-Runbook.md` | Zehn Abschnitte für L2-Diagnose, Eskalation, sicheren Retest und Muster-Ticketkommentar |
| `assets/rb039_henne_ei_tcp_port_dienst.png` | Comic-Infografik mit Henne und Ei im professionelleren Projektstil |
| `assets/rb039_diagnosebaum.svg` | Technischer skalierbarer Diagnose-Entscheidungsbaum |
| `assets/rb039_diagnosebaum_preview.png` | PNG-Vorschau des technischen Diagnosebaums |
| `README.md` | Dieses Blatt: Aufbau, Quellen, Sicherheitsprinzipien, spätere Laborvalidierung |

**Bildnachweis:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## Zentrale Diagnosekette

**Fehlerbild (FQDN/Ziel-IP/Port/Quelle) → TCP-Test vom Client → Listener auf Zielserver → Bind-Adresse/Prozess/Dienst → Pfad und Firewall → bei erfolgreichem TCP: echte Anwendung → freigegebene Korrektur → Retest und Dokumentation.**

**Wesentliche Unterscheidung:** Service `Running` ≠ Listener `Listen` ≠ TCP-Test `True` ≠ Anwendung funktionsfähig. RST und Timeout sind Hinweise, keine fertigen Ursachendiagnosen.

## Sicherheit, Voraussetzungen und Grenzen

- Ziel-/Porttests nur auf **autorisierten Systemen**, keine breit angelegten Portscans.
- Beispieldomain `.example` und Beispielnetz `192.0.2.0/24` sind reservierte Dokumentationswerte, kein reales Unternehmensnetz.
- PowerShell-Abschnitte sind lesend; `Test-NetConnection` sendet gezielte TCP-/Diagnoseanfragen und ist **nicht** völlig ohne Netzinteraktion.
- Kein pauschales Abschalten der Windows Defender Firewall, keine ungeplanten Dienste-/Serverneustarts, keine Portfreigabe auf Verdacht.
- Bevor eine Firewall-, Port-/Bindungs- oder VPN-Einstellung geändert wird: Owner/Freigabe, Rückweg, Impact, Rollback und geeigneten Wiederholungstest klären.
- Ein Firewall-Portfilter mit `LocalPort=8443` findet nicht jede wirksame Regel. Profile, Quellen, GPO/MDM, IPsec, EDR und externe Firewalls berücksichtigen.
- Wenn ein Reverse Proxy, Load Balancer oder Container beteiligt ist, kann der Endpunkt des TCP-Handshakes ein anderer Host als der Backend-Server sein.
- Kein Passwort, Token, Session-Cookie oder personenbezogenes Trace-Material ungeschützt in Tickets speichern.

## Herstellerquellen (Microsoft; Recherche 22.11.2026)

1. TCP/IP-Kommunikation und End-to-End-Diagnose: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-tcp-ip-communication-guidance
2. Windows-Client TCP/IP-Fehleranalyse: https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcp-ip-connectivity-issues-troubleshooting
3. PowerShell `Test-NetConnection`: https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps
4. PowerShell `Get-NetTCPConnection`: https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection?view=windowsserver2025-ps
5. TCP-Handshake: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/three-way-handshake-via-tcpip
6. Windows Firewall / lesende Regelabfragen: https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/configure-with-command-line
7. PowerShell `Get-NetFirewallPortFilter`: https://learn.microsoft.com/en-us/powershell/module/netsecurity/get-netfirewallportfilter?view=windowsserver2025-ps
8. SMB TCP-Handshake und WFP-Drops als konkretes Beispiel: https://learn.microsoft.com/en-us/troubleshoot/windows-server/storage/file-server/troubleshoot/tcp-three-way-handshake-fails
9. PowerShell `Get-Service`: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service?view=powershell-7.6

## Späteres Training und Website

**Empfohlene Laboraufgabe:** In einer ausdrücklich isolierten Testumgebung einen lokal vorgesehenen TCP-Dienst mit freigegebenem Port betreiben; getrennt `Running`, Listener, Loopback-Test, Remote-Test und echten Applikationsaufruf überprüfen. Ein freigegebener A/B-Vergleich (z. B. bewusst nur localhost gebundener Service versus LAN-Bindung) eignet sich, um die Hypothesen zu überprüfen. Keine Änderung an produktiven Firewalls zur Trainingssimulation.

**Lernprinzip:** Vor Einsicht in die Musteranalyse eigene Ursachenhypothesen und differenzierende Tests formulieren; Messwerte protokollieren; nach 7/21 Tagen vergleichbare, aber veränderte Fälle ohne Hilfe lösen.

**Website:** Kein Repository verändert, keine Inhalte veröffentlicht; die sechs Dateien sind für den späteren Import vorbereitet.
