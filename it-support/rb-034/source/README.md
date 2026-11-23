# RB-034 – DNS-Namensauflösung funktioniert nicht (L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Fachstatus:** Microsoft-Dokumentation recherchiert. **Praktische Validierung noch ausstehend.**

## Komplettpaket – genau sechs Dateien

```text
RB-034_DNS-Namensaufloesung-funktioniert-nicht/
├── README.md
├── RB-034_Lernartikel.md
├── RB-034_Praxis-Runbook.md
└── assets/
    ├── rb034_henne_ei_dns.png
    ├── rb034_diagnosebaum.svg
    └── rb034_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-034_Lernartikel.md` | 15 Kapitel mit DNS-Grundlagen, RCODEs, Windows-/Serverdiagnose, Testmatrix, zwei fiktiven Praxisfällen, Active Recall und offiziellen Quellen |
| `RB-034_Praxis-Runbook.md` | 10 Abschnitte für eine kontrollierte L1/L2-Ticketbearbeitung, sichere Eskalation, Retest und Drei-Satz-Ticketkommentar |
| `assets/rb034_henne_ei_dns.png` | Eigenständige professionelle Henne-und-Ei-Infografik zum DNS-Fehlerbild |
| `assets/rb034_diagnosebaum.svg` | Skalierbarer technischer DNS-Diagnosebaum mit Antwort-/Client-/Server-Verzweigungen |
| `assets/rb034_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums zur Website-Integration |
| `README.md` | Dateistruktur, Quellen, Grenzen und Lerngang |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“. Bilder sind didaktische Grafiken, keine Screenshots aus einer realen Kundenumgebung.

## Kerngedanke

**„Name funktioniert nicht“ ist noch keine Ursache.** Systematisch prüfen: **welcher FQDN und Recordtyp → welcher Resolver → welche Antwort → Unterschiede zwischen Cache, DNS-Server, Zone, Forwarder und VPN → sichere Korrektur → echter Anwendungstest**.

**Vier wichtige Abgrenzungen:**

1. **DNS erfolgreich** ≠ Zieldienst erreichbar.
2. **`nslookup`** fragt DNS-Server unabhängig vom lokalen Windows-DNS-Clientcache ab.
3. **TCP 53 erfolgreich** ≠ UDP 53 funktionierend.
4. **`NXDOMAIN` ≠ `SERVFAIL` ≠ Timeout**; diese Antworten benötigen unterschiedliche Hypothesen.

## Sichere Arbeitsgrenzen

- Alle Namespaces (`corp.example`) und Adressen (`10.20.x.x`) sind **fiktive Labordaten**. Keine personenbezogenen oder vertraulichen Netzwerkdetails veröffentlichen.
- PowerShell-/CMD-Beispiele im Lernartikel und Runbook sind **lesende Diagnosebefehle**; keine automatischen Änderungen.
- `ipconfig /flushdns`, Hosts-, VPN-/NRPT-/Firewall-, DHCP-, DNS-Zonen- oder Forwarderänderungen erst **nach Befundsicherung, Genehmigung und Rollbackplanung**.
- In AD-/VPN-Umgebungen **keinen öffentlichen DNS-Server** als vermeintliche universelle Reparatur eintragen.
- DNS-Cmdlets (`Get-DnsServer*`) setzen geeigneten Server-/RSAT-Kontext und Berechtigungen voraus; Cmdlet-Support ist versionsabhängig.
- Eine erfolgreiche DNS-Antwort schließt Fehler in Routing, TLS, Firewall, Authentisierung oder Anwendung **nicht** aus.

## Vorschlag zur praktischen Validierung

1. **Ohne Runbook:** Störungsmeldung ansehen; drei Hypothesen schriftlich formulieren.
2. **Lesende Tests:** Client-DNS, DNS-Cache, Host/FQDN, Resolverantworten gegenüberstellen.
3. **Labor:** Einen simulierten falschen DNS-Record / lokalen Cache-/Suffix- oder Forwarderfall auf isolierten VMs nachstellen, nur mit eigenständiger Freigabe.
4. **Eigenes Runbook:** Messung, Entscheidung, Sicherheitsgate, Korrektur und Retest in eigenen Worten dokumentieren.
5. **Abgleich:** Gegen recherchierten Lernartikel und Runbook prüfen; technische Ungenauigkeiten korrigieren.
6. **Wissensbehalt:** Diagnosekarten nach ca. 7 und 21 Tagen in veränderten Szenarien testen.

**Transparenz:** Ein kompletter ZIP- und Dateitest ist **keine** praktische Funktionsprüfung der DNS-Kommandos in einem realen Netzwerk.

## Quellen – Microsoft Learn (Recherche 22.11.2026)

- [Q1] https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/troubleshoot-dns-client-resolution-issues
- [Q2] https://learn.microsoft.com/de-de/windows-server/networking/dns/troubleshoot/troubleshoot-dns-client
- [Q3] https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname?view=windowsserver2025-ps
- [Q4] https://learn.microsoft.com/de-de/windows-server/networking/dns/troubleshoot/troubleshoot-dns-server
- [Q5] https://learn.microsoft.com/en-us/windows-server/networking/dns/forwarding
- [Q6] https://learn.microsoft.com/en-us/powershell/module/dnsclient/get-dnsclientnrptpolicy?view=windowsserver2025-ps
- [Q7] https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/dnsoverhttpsmode
- [Q8] https://learn.microsoft.com/en-us/powershell/module/dnsclient/get-dnsclientserveraddress
- [Q9] https://learn.microsoft.com/en-us/powershell/module/dnsclient/get-dnsclientcache
- [Q10] https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-dns-forwarders-related-failures
- [Q11] https://learn.microsoft.com/en-us/powershell/module/dnsserver/get-dnsserverresourcerecord?view=windowsserver2025-ps
- [Q12] https://learn.microsoft.com/en-us/powershell/module/dnsserver/get-dnsserverforwarder?view=windowsserver2025-ps
- [Q13] https://learn.microsoft.com/de-de/windows-server/networking/dns/configure-dns-forwarding

Die GitHub-Pages-Website wurde nicht verändert. Das Paket wird zur späteren Veröffentlichung und eigenständigen **praktischen Validierung** bereitgestellt.
