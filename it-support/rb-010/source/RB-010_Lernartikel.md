# RB-010 – Keine Netzwerk- oder Internetverbindung

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-010 · **Support-Level:** 1st / 2nd Level · **Umgebung:** Windows 11, Ethernet/WLAN, IP, DHCP, DNS, Routing, Firewall, VPN  
> **Dokumentationsstand:** 08.11.2026 · **Version:** 1.0  
> **Validierung:** Fachlich mit Microsoft-Dokumentation abgeglichen. Alle Geräte, Ausgaben, Zeitpunkte und Lösungen im Beispielticket sind **fiktiv**; praktische Tests stehen aus.

![RB-010: Keine Netzwerk- oder Internetverbindung – Henne-Ei-Infografik](assets/rb010_henne_ei_netzwerk.png)

*Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Die Grafik ist eine didaktische Vereinfachung. DNS ist beispielsweise ein Dienst zur Namensauflösung und **nicht zwingend eine Station, die jedes Datenpaket passiert**; ebenso sind die in der Grafik genannten Adressen nur Beispiele.*

## 1. Ausgangssituation und Supportticket

**Fiktives Ticket INC-010:**

> „Seit heute Morgen funktioniert das Internet auf meinem Windows-Rechner nicht. Im Browser laden keine Seiten. Gestern konnte ich noch normal arbeiten.“

**Beispielumgebung:** Windows 11 Pro, Client `PC-023`, Unternehmens-LAN, ein verwaltetes Unternehmensnetz. Der Mitarbeiter benötigt zusätzlich interne Webseiten und Microsoft 365. Namen und Adressen sind frei erfunden.

**Ziel:** Abgrenzen, ob tatsächlich die **Netzwerkverbindung**, die **Internetverbindung** oder nur **ein bestimmter Dienst** gestört ist. Die richtige Fehlerursache mit möglichst wenig Änderungen nachweisen und beheben.

**Leitsatz:** „Internet funktioniert nicht“ ist eine Problembeschreibung, noch **keine Diagnose**. Nicht als Erstes Firewall abschalten, DNS-Server tauschen oder den Netzwerkadapter zurücksetzen.

## 2. Was ist der Unterschied zwischen Netzwerk, Internet und einer Anwendung?

Ein **Netzwerk** verbindet Geräte zum Austausch von Daten. Ein **LAN (Local Area Network)** ist ein lokales Netzwerk, zum Beispiel im Büro. Das **Internet** verbindet viele einzelne Netze über Router miteinander. Ein Rechner kann eine völlig funktionierende Verbindung zum Unternehmens-LAN haben und dennoch keine externen Websites erreichen.

Andererseits kann das Internet funktionieren, während eine interne Firmenanwendung wegen fehlendem **VPN (Virtual Private Network)** oder wegen Berechtigungen nicht erreichbar ist.

### Vereinfachtes Modell

```text
Windows-Client
   │  1. Netzwerkadapter, Kabel oder WLAN
   ▼
Lokales Netz (Switch / Access Point)
   │  2. IP-Adresse und Subnetz
   ▼
Router / Standardgateway
   │  3. Route und Firewall-/VPN-Regeln
   ├──────────────► Interne Server und Dienste
   ▼
Internet / externer Zielserver

DNS-Dienst: übersetzt Namen wie 'intranet.firma.example' in IP-Adressen.
Er ist eine eigene Dienstfunktion, nicht automatisch ein Router-Hop.
```

**Die Verbindungskette kann an mehreren Stellen scheitern.** Wir prüfen deshalb schrittweise von der nächstliegenden Komponente bis zu der tatsächlich betroffenen Anwendung.

### Begriffe für Einsteiger

| Begriff | Einfache Erklärung | Warum wichtig? |
|---|---|---|
| **NIC (Network Interface Card)** | Netzwerkschnittstelle, etwa Ethernet- oder WLAN-Adapter. | Ohne funktionsfähige Schnittstelle kein Netzwerkverkehr. |
| **Ethernet / LAN** | Kabelgebundene lokale Netzwerkverbindung. | Kabel, Switchport oder Adapter können ausfallen. |
| **WLAN (Wireless Local Area Network)** | Drahtloser Netzzugang über einen Access Point. | Eine Funkverbindung kann trotz fehlendem Internet bestehen. |
| **IP-Adresse (Internet Protocol)** | Logische Adresse eines Geräts innerhalb eines IP-Netzes. | Erforderlich für die Zustellung der Pakete. |
| **Subnetz / Präfix** | Legt fest, welche Adressen aus Sicht des Clients zum lokalen Netz gehören. | Fehler können lokale oder entfernte Ziele unzugänglich machen. |
| **DHCP (Dynamic Host Configuration Protocol)** | Verteilt häufig automatisch IP-Adresse, Subnetz, Gateway und DNS-Server. | Fehlerhafte Vergabe kann den IP-Zugriff verhindern. |
| **APIPA (Automatic Private IP Addressing)** | Windows-Fallback für IPv4-Link-Local-Adressen aus `169.254.0.0/16`. | Bei erwartetem DHCP-Bezug ein wichtiger Hinweis auf ein Adressierungsproblem. |
| **Gateway (Standardgateway)** | Router, an den der Client Verkehr für Ziele außerhalb des lokalen Netzes weitergibt. | Ohne passenden Weg bleiben entfernte Netze unerreichbar. |
| **Routing** | Auswahl des Wegs, über den Pakete zum Ziel übertragen werden. | Falsche Routen können den Datenverkehr ins falsche Netz schicken. |
| **DNS (Domain Name System)** | Übersetzt Namen in IP-Adressen. | Namensfehler erscheinen Benutzern oft wie Internetausfall. |
| **TCP (Transmission Control Protocol)** | Verbindungsorientiertes Transportprotokoll. | Ein TCP-Porttest prüft die Verbindung zu einem bestimmten Dienst. |
| **Port** | Logische Nummer eines Netzwerkdienstes, z. B. `443` für HTTPS. | Ein Server kann erreichbar sein, während ein bestimmter Dienst blockiert ist. |
| **HTTPS (Hypertext Transfer Protocol Secure)** | Üblicherweise verschlüsselte Kommunikation mit Webseiten über TLS. | Ein Port-443-Test ist ein Teil der HTTPS-Diagnose, kein vollständiger Webtest. |
| **ICMP (Internet Control Message Protocol)** | Netzwerkprotokoll für Diagnose- und Steuerinformationen; `ping` verwendet es. | ICMP kann gefiltert sein, obwohl der Dienst funktioniert. |
| **Firewall** | Kontrolliert Netzwerkverkehr anhand von Regeln. | Kann zulässige oder unerwünschte Verbindungen blockieren. |
| **Proxy** | Vermittlungsserver für bestimmte Anwendungszugriffe, etwa HTTP/HTTPS. | Eine falsche Proxykonfiguration kann den Browser blockieren. |
| **VPN (Virtual Private Network)** | Geschützter Tunnel zu einem anderen Netz, oft zur Firma. | Beeinflusst erreichbare Ziele, DNS und Routing. |
| **VLAN (Virtual Local Area Network)** | Logisches Teilnetz auf Switch-Ebene. | Falsche VLAN-Zuordnung kann DHCP und die Erreichbarkeit beeinflussen. |
| **NCSI (Network Connectivity Status Indicator)** | Windows-Funktion zur Bewertung der Internetverbindung. | Windows kann „Kein Internet“ anzeigen, obwohl ausgewählte Ziele erreichbar sind. |

**Quellen:** [Microsoft: DNS-Clientdiagnose](https://learn.microsoft.com/de-de/windows-server/networking/dns/troubleshoot/troubleshoot-dns-client) · [Microsoft: DHCP-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-dhcp-guidance) · [Microsoft: NCSI-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-ncsi-guidance)

## 3. Was fragt der First Level zuerst?

Bevor irgendein Befehl gestartet wird, werden **Auswirkungen und Reichweite** geklärt.

1. **Seit wann?** Plötzlich, nach Update/Umzug oder nur gelegentlich?
2. **Was ist betroffen?** Alle Websites, nur eine Firmenanwendung, nur Microsoft 365?
3. **Wer ist betroffen?** Ein PC, ein Raum, eine Abteilung, der gesamte Standort?
4. **Welche Verbindung?** Ethernet, WLAN, Homeoffice-VPN oder Hotspot?
5. **Wie lautet die Meldung?** „Keine Verbindung“, „DNS_PROBE_FINISHED…“, „Zeitüberschreitung“ usw.
6. **Welche Änderungen gab es?** Dockingstation, neues Kabel, VPN-Client, Proxy, Update, Netzwerkwartung?
7. **Ist der Remotezugriff betroffen?** Über welche Verbindung führen wir die Diagnose aus?

| Benutzerbeobachtung | Möglicher Bereich | Nächster Schritt |
|---|---|---|
| Windows meldet „Nicht verbunden“ | Adapter / Kabel / WLAN | Link-Status und Verbindung untersuchen |
| Windows meldet „Kein Internet“ | NCSI, DNS, Gateway, Proxy, Internetzugang | Unabhängige Tests gegen konkrete Ziele durchführen |
| IP-Adresse `169.254.x.x` bei erwartetem DHCP | DHCP-/VLAN-/Verbindungspfad | Adressbezug und Adapterkonfiguration überprüfen |
| Interne Dienste funktionieren, externe Websites nicht | Internet-Uplink, Proxy, Filter-/Routingregeln | Externes HTTPS-Ziel und Proxy prüfen |
| Eine Anwendung scheitert, andere funktionieren | Anwendung, Dienst, Port, Zielsystem | Konkreten Zielport prüfen |
| Nur Hostnamen scheitern, direkte IP-Verbindung funktioniert | DNS möglicherweise betroffen | DNS-Server und Auflösung untersuchen |
| Mehrere Nutzer gleichermaßen betroffen | Gemeinsame Infrastruktur | Netzwerkteam mit Zeitpunkt und Reichweite informieren |

**Wichtig:** Ein Fehler in der Browseranzeige kann aus einem Proxy-, Zertifikats- oder Anwendungsproblem entstehen. Auch ein funktionierendes Ping beweist nicht, dass ein HTTPS-Dienst korrekt arbeitet.

## 4. Von wo darf und kann der Support diagnostizieren?

| Situation | Zugriff | Konkretes Vorgehen |
|---|---|---|
| Client ist noch über LAN erreichbar | Freigegebenes RDP (*Remote Desktop Protocol*) oder PowerShell-Remoting | Mit eigenem berechtigten Konto lesende Diagnosen ausführen. |
| Client hat Internet, aber interne Dienste sind gestört | Teams/Schnellhilfe oder Remote-Management, wenn verfügbar | Gemeinsame Sicht auf Meldungen; VPN/DNS/interne Zieladresse prüfen. |
| Kein Netz und kein Remotezugang | Telefon, lokale Prüfung, vor Ort | Mitarbeiter führt sichere lesende Abfragen aus; ggf. Kabel/Switchport prüfen. |
| Viele Geräte oder ein Standort betroffen | Netzwerkmanagement durch zuständiges Team | Switch, VLAN, Gateway, DHCP, DNS, Firewall, WAN-Uplink untersuchen. |
| Gerät läuft über VPN | Freigegebener VPN-/Clientzugang | Aktiven Tunnel und Routen untersuchen, bevor dessen Konfiguration verändert wird. |

**Praxisregel:** Wenn du über genau die Netzwerkverbindung auf dem Client arbeitest, die du zurücksetzt, bricht möglicherweise deine Supportsitzung ab. Änderungen am Adapter, an Routen oder VPN-Tunneln benötigen einen Rückweg und gegebenenfalls lokale Unterstützung.

## 5. Diagnose-Entscheidungsbaum

![RB-010 – Technischer Diagnose-Entscheidungsbaum](assets/rb010_diagnosebaum.svg)

**Textalternative:** 1) Adapter verbunden? 2) IP-/DHCP-Konfiguration plausibel? 3) Gateway bzw. Route zum Ziel vorhanden? 4) DNS-Auflösung für das Ziel korrekt? 5) Konkreter TCP-Port/Dienst erreichbar? 6) Gezielte Maßnahme, erneut testen und dokumentieren. Jeder Fehlschlag führt in den passenden Diagnosezweig. Bei Standortausfällen können Infrastrukturprüfungen parallel stattfinden.

## 6. Erste lesende Diagnose: Adapter und IP-Konfiguration

**Ausführungsort:** Betroffener Windows-11-Client, in PowerShell. Die folgenden Befehle **verändern keine Einstellungen**.

### A – Status der Netzwerkadapter

```powershell
# Zeigt aktive, deaktivierte und getrennte Netzwerkadapter an.
# Die Pipeline | leitet das Ergebnis an Select-Object weiter.
# Select-Object beschränkt die sichtbaren Spalten.
Get-NetAdapter |
    Select-Object Name, Status, InterfaceDescription, LinkSpeed
```

**Interpretation:** `Up` weist auf eine vorhandene Verbindung auf Schnittstellenebene hin, nicht auf funktionierendes Internet. `Disconnected` kann z. B. auf ein entferntes Kabel hindeuten. Ein abgeschalteter Adapter kann administrativ oder hardwareseitig bedingt sein. `LinkSpeed` ist **nicht** die tatsächlich gemessene Internetgeschwindigkeit.

### B – IP-, DNS- und Gatewaydaten

```powershell
# Zeigt die wichtigsten IP-Konfigurationsdaten aktiver Adapter.
Get-NetIPConfiguration

# Zeigt zusätzliche Informationen, darunter DHCP- und DNS-Angaben.
# ipconfig.exe ist ein Windows-Konsolenprogramm und kein PowerShell-Cmdlet.
ipconfig /all

# Zeigt alle Schnittstellen mit zusätzlichen Eigenschaften,
# darunter auch virtuelle und derzeit nicht verbundene Adapter.
Get-NetIPConfiguration -All -Detailed
```

**Interpretation:** Zur jeweiligen Schnittstelle gehören IP-Adresse, Präfix/Subnetz, Standardgateway und DNS-Server. Bei mehreren Schnittstellen (WLAN, LAN, VPN, Hyper-V) muss klar sein, **welche Schnittstelle den Verkehr zum fraglichen Ziel tatsächlich sendet**.

### Beispielausgabe (fiktiv)

```text
Ethernet-Adapter:
  IPv4-Adresse        192.168.50.25
  Subnetzmaske        255.255.255.0
  Standardgateway     192.168.50.1
  DNS-Server          192.168.50.99
  DHCP aktiviert      Nein
```

Hier sieht die IPv4-Adresse plausibel aus. Ob `192.168.50.99` der *richtige* DNS-Server ist, erfahren wir erst durch Vergleich mit der dokumentierten Sollkonfiguration. **Ein vorhandener DNS-Servereintrag beweist noch nicht, dass dieser DNS-Server erreichbar ist.**

### C – Was bedeutet `169.254.x.x` genau?

Wenn Windows mit aktivierter automatischer IPv4-Adressierung (DHCP) keinen gültigen DHCP-Lease erhält, kann es automatisch eine Link-Local-Adresse aus `169.254.0.0/16` vergeben (*APIPA*). Damit ist eingeschränkte Kommunikation auf dem lokalen Segment möglich; ein normaler gerouteter Unternehmenszugriff ist darüber typischerweise nicht hergestellt.

**Nicht jeder DHCP-Fehler führt zwingend sofort zu APIPA**, und eine solche Adresse allein beweist nicht, welcher Teil des DHCP-Pfades defekt ist. Auch Kabel, VLAN, Switchport, DHCP-Relay, DHCP-Server oder Clientkonfiguration kommen infrage.

**Quelle:** [Microsoft – DHCP-Fehlerdiagnose](https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue)

## 7. Gateway und Routing prüfen

Ein **Standardgateway** ist der nächste Router, an den ein Client Pakete für nicht lokal bekannte Ziele weitergibt. Eine **Route** beschreibt, welchen nächsten Weg Windows zu einer Zieladresse verwendet.

**Ausführungsort:** Betroffener Windows-Client, PowerShell.

```powershell
# Zeigt die IPv4-Routingtabelle in einem Windows-Konsolenformat.
route print -4

# Ruft alle bekannten IPv4-Standardrouten ab.
# 0.0.0.0/0 bezeichnet die IPv4-Standardroute.
Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' |
    Select-Object DestinationPrefix, NextHop, InterfaceAlias, RouteMetric

# Prüft per ICMP die Erreichbarkeit des beispielhaften Gateways.
# Die tatsächliche Gateway-IP stammt aus der vorherigen Konfigurationsprüfung.
ping 192.168.50.1
```

**Interpretation:** Ist keine zum Ziel passende Route vorhanden, muss die Konfiguration geprüft werden. Mehrere Standardrouten können bei LAN/WLAN/VPN auftreten und sind nicht automatisch falsch. Bei `ping` gilt: **Keine ICMP-Antwort bedeutet nicht immer Unerreichbarkeit**, weil Geräte oder Firewalls ICMP blockieren können. Deshalb sind eine plausible Routingtabelle und konkrete Diensttests zusätzlich wichtig.

### Erweiterte Zielpfadprüfung

```powershell
# Zeigt die von Windows gewählte Route in einer Diagnoseansicht.
# Der Zielname ist ein Beispiel für einen externen HTTPS-Dienst.
Test-NetConnection -ComputerName 'www.microsoft.com' -DiagnoseRouting -InformationLevel Detailed

# Tracert zeigt sichtbare IPv4-Routerstationen auf dem Weg zum Ziel.
# Einzelne Hops können auf ICMP nicht antworten und als * erscheinen.
tracert -4 www.microsoft.com
```

**Wichtig:** Routing- und Traceroute-Ergebnisse hängen von Firewall-/Netzwerkrichtlinien ab. Ein `*` an einem Hop ist allein noch kein Fehlerbeweis.

**Quelle:** [Microsoft – Get-NetRoute](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netroute) · [Microsoft – Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)

## 8. DNS-Namensauflösung untersuchen

**DNS (Domain Name System)** übersetzt Namen in IP-Adressen. Ein Benutzer denkt oft „kein Internet“, wenn eine Anwendung nur die benötigte Serveradresse nicht auflösen kann.

**Ausführungsort:** Betroffener Client.

```powershell
# Fragt die Adresse einer bekannten öffentlichen Website per DNS ab.
Resolve-DnsName -Name 'www.microsoft.com'

# Befragt einen konkret angegebenen internen DNS-Server.
# Die Adresse 192.168.50.10 ist ein fiktiver Unternehmens-DNS-Server.
Resolve-DnsName -Name 'intranet.firma.example' -Server '192.168.50.10'

# Zeigt DNS-Server-Zuweisungen der Netzwerkschnittstellen.
Get-DnsClientServerAddress |
    Select-Object InterfaceAlias, AddressFamily, ServerAddresses
```

**Interpretation:** Wenn die Auflösung über den eingetragenen DNS-Server scheitert, über den bekannten internen Server aber funktioniert, weist das auf eine falsche oder unerreichbare DNS-Konfiguration hin. Wenn beide scheitern, müssen DNS-Dienst, Netzwerkpfad und der korrekte Name geprüft werden. Ein Fehler nur für einen bestimmten Namen kann auch ein fehlender DNS-Datensatz sein.

**Sicherheits- und Praxisregel:** Den DNS-Server eines **Domänen-Clients** nicht blind auf `8.8.8.8` oder einen anderen öffentlichen Resolver ändern. Diese können interne Active-Directory-Namen und Dienststandorte möglicherweise nicht auflösen.

**Quelle:** [Microsoft – DNS-Clientproblembehandlung](https://learn.microsoft.com/de-de/windows-server/networking/dns/troubleshoot/troubleshoot-dns-client) · [Microsoft – Resolve-DnsName](https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname)

## 9. Konkretes Ziel und TCP-Port prüfen

Ein erfolgreich aufgelöster Name garantiert keinen funktionierenden Dienst. Die **TCP-Verbindung** zum benötigten Port muss separat geprüft werden.

```powershell
# Prüft DNS und den TCP-Verbindungsaufbau zu HTTPS-Port 443.
# Das Ziel ist eine öffentliche Microsoft-Website.
Test-NetConnection -ComputerName 'www.microsoft.com' -Port 443

# Prüft einen internen HTTPS-Dienst per IP-Adresse.
# Die Beispieladresse muss im realen Ticket ersetzt werden.
Test-NetConnection -ComputerName '192.168.50.20' -Port 443
```

**Beispielbefunde:**

| Ergebnis | Interpretation |
|---|---|
| `TcpTestSucceeded : True` | TCP-Verbindungsaufbau auf dem geprüften Port funktioniert. Die Website oder Anmeldung kann trotzdem fehlerhaft sein. |
| `TcpTestSucceeded : False` | TCP-Verbindungsaufbau scheitert. Ursachen: Netzwerkpfad, Firewall, Proxyarchitektur, Zielport nicht offen, Dienst nicht aktiv oder Zielausfall. |
| Name löst nicht auf | Zuerst DNS-/Name-Konfiguration prüfen, bevor ein Porttest mit Namen sinnvoll interpretiert werden kann. |

**Wichtig:** Ein HTTPS-Proxy kann dafür sorgen, dass der Browser funktioniert, obwohl ein direkter TCP-Test zum Ziel nicht dem vorgesehenen Pfad entspricht. DNS und Porttests dürfen daher nicht isoliert interpretiert werden.

**Quelle:** [Microsoft – Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)

## 10. Proxy, VPN, Firewall und die Windows-Meldung „Kein Internet“

### A – Proxy

Ein **Proxyserver** vermittelt bestimmte Anfragen zu externen Ressourcen. Wird er durch Gruppenrichtlinien (GPO), eine automatische Konfigurationsdatei (PAC) oder manuell eingerichtet, kann ein falscher Proxy den Browserzugriff blockieren.

```powershell
# Zeigt die WinHTTP-Proxykonfiguration an.
# Achtung: Sie muss NICHT mit allen Browser-/Benutzerproxywerten übereinstimmen.
netsh winhttp show proxy
```

**Anschließend:** Proxy-/PAC-Konfiguration des tatsächlich betroffenen Browsers oder Windows-Benutzerkontos prüfen. Keine Proxy-Einstellung ohne dokumentierte Sollkonfiguration überschreiben.

### B – VPN und Routing

Ein VPN kann neue Netzwerkschnittstellen, DNS-Server und Routen hinzufügen. Ein fehlerhafter Tunnel oder unpassendes *Split Tunneling* (nur bestimmte Ziele durch das VPN) kann dazu führen, dass Internet oder Firmenressourcen nicht erreichbar sind.

**Prüfung:** VPN verbunden? Welche IP/Gateway-/DNS-Konfiguration gilt? Welche Route gewinnt für das konkrete Ziel? Ist eine Firmenressource nur mit VPN erreichbar? Bei eingeschaltetem VPN keine eigenmächtigen Routenänderungen durchführen.

### C – Firewall

Eine Firewall lässt Verkehr anhand von Regeln zu oder blockiert ihn. Das gilt sowohl am Client als auch auf Servern, Routern, Unternehmens-Firewalls oder in Cloudumgebungen. **Firewall nicht als Diagnosetrick komplett deaktivieren.** Stattdessen eine konkrete Verbindung und die zugehörige Regel/Protokollierung prüfen.

### D – NCSI und „Kein Internet“

Der **Network Connectivity Status Indicator (NCSI)** ermittelt in Windows den angezeigten Netzwerkstatus über eigene Prüfungen. Wenn diese beispielsweise an Proxy oder Firewall scheitern, kann „Kein Internet“ erscheinen, obwohl einzelne Ziele erreichbar sind. Umgekehrt garantiert eine positive Anzeige nicht, dass jede Firmenanwendung funktioniert.

**Praxistest:** Eine tatsächliche benötigte Website beziehungsweise einen internen Dienst testen und NCSI nur als zusätzliche Information behandeln. Die NCSI-Prüfungen nicht einfach abschalten.

**Quelle:** [Microsoft – NCSI-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-ncsi-guidance)

## 11. Interpretation typischer Diagnosebefunde

| Befund | Was er stützt | Was er nicht beweist | Nächster Schritt |
|---|---|---|---|
| Adapter `Disconnected` | Kein aktiver Link auf dem Adapter | Nicht automatisch Treiberdefekt | Kabel/Port/WLAN/Adapterstatus kontrollieren |
| `169.254.x.x` bei erwarteter DHCP-Konfiguration | DHCP-Vorgang erfolglos oder keine nutzbare IPv4-Zuweisung | Nicht zwingend DHCP-Server defekt | Adapter, VLAN, DHCP-Client, Relay/Server prüfen |
| IP und Gateway plausibel | Grundkonfiguration vorhanden | Nicht automatisch korrekt geroutete Pakete | Route und konkrete Ziele prüfen |
| Gateway-Ping ohne Antwort | ICMP zum Gateway nicht erfolgreich | Nicht automatisch Gateway ausgefallen | Router-/ARP-/Dienstzugriff und Regeln prüfen |
| IP-Ziel per TCP erreichbar, Hostname nicht auflösbar | DNS-/Namensproblem möglich | Nicht automatisch fehlerhafte DNS-Server-Software | Eingetragenen Resolver, Zonen und Route prüfen |
| DNS erfolgreich, Port 443 nicht erreichbar | Transportweg/Dienst betroffen | Nicht automatisch Firewalldefekt | Zieldienst, Firewall, Proxy, Route prüfen |
| Nur mit VPN gestört | VPN-Routing/DNS/Policy beteiligt | Nicht automatisch VPN-Software defekt | Tunnel, Routen, DNS-Suffix/Policy prüfen |
| Mehrere Arbeitsplätze betroffen | Gemeinsame Infrastruktur wahrscheinlich | Nicht automatisch WAN-Ausfall | Incident-Scope und Netzwerkteam informieren |

## 12. Veränderungen nur nach konkretem Befund

| Nachgewiesener Bereich | Zulässige Maßnahme nach Freigabe | Risiko / Rückfallplan |
|---|---|---|
| LAN-Kabel/Port defekt | Kabel/Port entsprechend Betriebsverfahren tauschen | Switch-Port-/VLAN-Zuordnung berücksichtigen |
| WLAN deaktiviert | Korrektes WLAN-Profil beziehungsweise Adapter aktivieren | Fernwartung über WLAN kann abbrechen |
| DHCP-Lease veraltet/inkonsistent | Kontrollierte DHCP-Erneuerung | Kann IP, Route, DNS und Remotesitzung ändern |
| DNS falsch eingetragen | Sollkonfiguration wiederherstellen (GPO/MDM/DHCP/manuell, je nach Betrieb) | Domänenzugriff durch falsche Resolverauswahl gefährdet |
| VPN-Route fehlerhaft | Dokumentierte VPN-/Routingkonfiguration korrigieren | Zugriff auf Firmenressourcen oder Remotezugang kann wegfallen |
| Zielport durch Regel blockiert | Zuständige L2-Stelle passt konkrete Regel an | Keine pauschale Firewall-Abschaltung |
| Zentraler DHCP-/DNS-/Gateway-Ausfall | Infrastrukturteam behebt zentral | Betroffene Benutzer/Standorte und Wartungsbedarf beachten |

### Beispiel eines verändernden Befehls – ausdrücklich **nicht** als erster Diagnoseschritt

```powershell
# VORSICHT: Erneuert die DHCP-Adresszuweisung auf dem angegebenen Adapter.
# Nur verwenden, wenn das Interface und die Folgen bekannt sind.
# Während einer Remotesitzung kann die Verbindung dabei abbrechen.
# Der Adaptername ist ein Beispiel; das tatsächliche Interface vorher prüfen.
ipconfig /renew "Ethernet"
```

**Achtung:** Falls der Adapter manuell/statisch konfiguriert ist, lässt sich der Fehler nicht einfach durch eine DHCP-Erneuerung beheben. Ein vollständiger Netzwerkreset oder das Zurücksetzen von TCP/IP ist als Standardmaßnahme ungeeignet, weil Konfigurationen und Remotezugriffe betroffen sein können.

**Quelle:** [Microsoft – DHCP-Clientproblembehandlung](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-problems-dhcp-client)

## 13. 1st- und 2nd-Level-Abgrenzung

| First Level (L1) | Second Level (L2) |
|---|---|
| Ticket, Zeitpunkt, Auswirkungen aufnehmen | Umfangreiche, standortweite Störungen korrelieren |
| Adapterstatus, IP, Gateway und DNS auslesen | Switch/VLAN, DHCP-Relay, Server und Firewalls analysieren |
| Betroffene Anwendung und bekannte Ziele testen | Paketmitschnitt, Routingtabellen und Policy untersuchen |
| Freigegebene Standardmaßnahmen durchführen | Komplexe VPN-/DNS-/Routingkonfiguration anpassen |
| Ergebnisse dokumentieren und gezielt eskalieren | Dauerhafte Ursache, Prävention und Monitoring prüfen |

**Abgrenzung nach Organisation:** Zuständigkeiten hängen von Berechtigungen und Betriebsvereinbarungen ab. Eine umfangreiche Änderung am produktiven Gateway gehört nicht allein wegen des Titels „L2“ zur frei verfügbaren Supportkompetenz.

## 14. Fiktiver Musterfall und professioneller Ticketkommentar

### Fiktive Untersuchung

- Client `PC-023` ist per Ethernet verbunden, `192.168.50.25/24`, Gateway `192.168.50.1`.
- Der eingetragene DNS-Server ist `192.168.50.99`; dokumentierter Soll-DNS ist `192.168.50.10`.
- Ein freigegebener interner HTTPS-Dienst `192.168.50.20:443` lässt sich per TCP erreichen.
- `Resolve-DnsName intranet.firma.example` schlägt über die Standardkonfiguration fehl, mit `-Server 192.168.50.10` funktioniert es.
- Nach autorisierter Korrektur der DNS-Zuweisung kann der Client die benötigten Namen auflösen und die Anwendung nutzen.

**Das ist ein konstruiertes Lehrbeispiel, keine tatsächlich durchgeführte Störungsbehebung.**

### Muster-Ticketkommentar

> **INC-010 – DNS-Auflösung am Arbeitsplatz gestört**  
> **Fehlerbild:** Benutzer konnte mehrere Unternehmenswebseiten nicht über Hostnamen öffnen.  
> **Diagnose:** Netzadapter aktiv; gültige IP und Gateway. Interner HTTPS-Dienst per IP/Port erreichbar. DNS-Namensauflösung über konfigurierten Resolver fehlgeschlagen. Vergleichstest mit dokumentiertem DNS-Server erfolgreich.  
> **Ursache:** Am Client war ein nicht vorgesehener DNS-Server eingetragen.  
> **Maßnahme:** DNS-Konfiguration gemäß Freigabe und Standard wiederhergestellt.  
> **Ergebnis:** Namensauflösung und Zugriff auf die benötigte Anwendung erfolgreich getestet.  
> **Status:** Gelöst.

## 15. Lernkontrolle und Wissenstransfer

**Wissenskarten (später für Anki):** Was macht DHCP? Was bedeutet `169.254.0.0/16`? Wofür steht DNS? Was prüft `Test-NetConnection -Port 443`?

**Verständniskarten:** Warum kann der PC ein lokales NAS erreichen, aber nicht das Internet? Warum beweist ein fehlgeschlagener Ping keinen Totalausfall? Warum darf ein Unternehmensclient nicht blind auf einen öffentlichen DNS-Server umgestellt werden?

**Diagnosekarten:**

1. Ein Client hat `169.254.22.18` und soll seine Adresse über DHCP beziehen. Welche drei Komponenten prüfst du zuerst und warum?
2. Die IP-Adresse eines internen Webservers ist erreichbar, sein Name wird nicht aufgelöst. Welche Hypothese testest du und wie?
3. Nach dem VPN-Aufbau funktioniert das Firmennetz, aber keine externe Website mehr. Welche Routen und DNS-Einstellungen willst du vergleichen?

**Praxis ohne zusätzliche VM:** Auf einem vorhandenen Windows-11-Rechner lassen sich `Get-NetAdapter`, `Get-NetIPConfiguration`, `route print -4`, `Resolve-DnsName`, `Test-NetConnection` und die Windows-Netzwerkstatusanzeige zunächst **nur lesend** untersuchen. So sind viele Grundlagen auch auf einem Laptop mit 16 GB RAM trainierbar. Fiktive Musterwerte dürfen dabei nicht als echte Tests ausgegeben werden.

### Quellen und technischer Stand

| Quelle | Wofür genutzt? |
|---|---|
| [Microsoft Learn – DNS-Clientproblembehandlung](https://learn.microsoft.com/de-de/windows-server/networking/dns/troubleshoot/troubleshoot-dns-client) | IP-/DNS-Konfiguration, DNS-Tests |
| [Microsoft Learn – DNS-Clientnamensauflösung](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/troubleshoot-dns-client-resolution-issues) | DNS-Zeitüberschreitungen und praktische Fehlerbilder |
| [Microsoft Learn – DHCP-Leitfaden](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-dhcp-guidance) | DHCP, Relay, VLAN, Server-/Clientanalyse |
| [Microsoft Learn – DHCP-Clientfehler](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-problems-dhcp-client) | DHCP-Clientdienst, Logs, Renewal |
| [Microsoft Learn – NCSI-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-ncsi-guidance) | Bedeutung der Windows-Meldung „Kein Internet“ |
| [Microsoft Learn – Get-NetIPConfiguration](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipconfiguration) | IP-Konfiguration über PowerShell |
| [Microsoft Learn – Get-NetRoute](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netroute) | Routingtabelle |
| [Microsoft Learn – Resolve-DnsName](https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname) | DNS-Abfragen |
| [Microsoft Learn – Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection) | TCP-, ICMP- und Routingtests |

*Quellenrecherche: 08.11.2026. Die Befehle sind für freigegebene Windows-Umgebungen dokumentiert. Praktische Prüfung mit echten Messergebnissen folgt gesondert.*
