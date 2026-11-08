# RB-009 – WLAN-Verbindung funktioniert nicht

> **50 Tickets – 50 typische Supportfälle**  
> **Ticket:** INC-009 · **Support-Level:** 1st / 2nd Level · **Umgebung:** Windows 11, WLAN-Adapter, Access Point, DHCP/DNS, optional Unternehmens-WLAN (802.1X)  
> **Dokumentationsstand:** 08.11.2026 · **Version:** 1.0  
> **Validierungsstatus:** Fachlich anhand offizieller Microsoft-Dokumentation recherchiert. Alle Namen, Messwerte und Testergebnisse sind **fiktive Lernbeispiele**; ein eigener Praxistest steht aus.

![RB-009: WLAN-Verbindung funktioniert nicht – Henne-Ei-Infografik](assets/rb009_henne_ei_wlan.png)

*Infografik: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT. Illustrative Darstellung und keine Aufnahme einer tatsächlichen Kundenumgebung.*

## 1. Ausgangssituation und Ticket

**Fiktives Ticket INC-009:**

> „Mein Laptop zeigt das Firmen-WLAN an, aber ich kann mich seit heute Morgen nicht mehr verbinden. Mein Kollege sitzt neben mir und ist ganz normal online.“

**Beispielumgebung:** Windows-11-Laptop `NB-023`, Firmen-WLAN mit Netzwerkname `Firma-Intern`, mehrere Access Points (APs). Die Gerätenamen und die SSID sind erfunden.

**Ziel:** Feststellen, ob die Störung beim WLAN-Adapter, der Funksichtbarkeit, der WLAN-Anmeldung, der IP-Konfiguration oder bei der Erreichbarkeit des benötigten Dienstes liegt. Nur die nachgewiesene Fehlerursache beheben.

**Grundregel:** „WLAN geht nicht“ ist ein Symptom. Nicht automatisch Treiber löschen, WLAN-Profile zurücksetzen oder den Access Point neu starten.

## 2. Technische Grundlagen – WLAN ist nicht dasselbe wie Internet

Ein typischer Verbindungspfad lautet:

```text
Windows-Laptop
   │ WLAN-Funkadapter und Treiber
   ▼
Funkverbindung zum Access Point (AP)
   │ WLAN-Anmeldung: WPA2/WPA3 Personal oder Enterprise
   ▼
Lokales Netzwerk: Switch / VLAN / DHCP / Gateway
   │ DNS und Routing / Firewall
   ▼
Firmennetz oder Internet / gewünschter Dienst
```

**Wichtig:** Das Funknetz kann erfolgreich verbunden sein, während die IP-Adresse fehlt, DNS nicht antwortet oder eine Firewall den eigentlichen Zugriff verhindert. Ein WLAN-Symbol mit Empfangsbalken beweist nicht, dass eine konkrete Website erreichbar ist.

### Begriffe verständlich erklärt

| Begriff | Bedeutung | Relevanz im Ticket |
|---|---|---|
| **WLAN (Wireless Local Area Network)** | Drahtloses lokales Netzwerk. | Verbindet den Client über Funk mit dem lokalen Netz. |
| **Wi-Fi** | Marken-/Technikbezeichnung für interoperable WLAN-Produkte. | Im Alltag meist gleichbedeutend mit WLAN verwendet. |
| **SSID (Service Set Identifier)** | Der angezeigte Name eines WLANs, z. B. `Firma-Intern`. | Ein Name kann an mehreren Access Points angeboten werden. |
| **AP (Access Point)** | Funkbasisstation, die WLAN-Clients mit dem Netzwerk verbindet. | Einzelner defekter AP kann nur einen Gebäudeteil betreffen. |
| **BSSID (Basic Service Set Identifier)** | Kennung der jeweiligen Funkzelle, häufig die MAC-Adresse des AP-Radios. | Hilft, einen betroffenen Access Point zu ermitteln. |
| **MAC-Adresse (Media Access Control)** | Kennung einer Netzwerkschnittstelle auf der Sicherungsschicht; bei WLAN können zufällige Client-Adressen verwendet werden. | Kann in AP-Logs und WLAN-Berichten vorkommen. |
| **WPA2/WPA3 (Wi-Fi Protected Access)** | Sicherheitsstandards für WLANs. | Modus und Schlüssel-/Anmeldemethode müssen zueinander passen. |
| **802.1X** | Standard für port-/netzwerkbasierte Zugangskontrolle, häufig im Firmen-WLAN. | WLAN kann sichtbar sein, aber Anmeldung am Netz scheitert. |
| **EAP (Extensible Authentication Protocol)** | Rahmenwerk für verschiedene Authentifizierungsmethoden in 802.1X. | Häufig z. B. EAP-TLS mit Zertifikaten. |
| **RADIUS (Remote Authentication Dial-In User Service)** | Protokoll zur Weiterleitung und Prüfung von Zugangsversuchen. | AP/Controller kann eine Anmeldung durch einen RADIUS-Server prüfen lassen. |
| **NPS (Network Policy Server)** | Microsofts Implementierung eines RADIUS-/Netzwerkrichtlinienservers. | Ereignisse `6272` (gewährt) und `6273` (verweigert) unterstützen L2-Diagnose. |
| **DHCP (Dynamic Host Configuration Protocol)** | Weist Clients automatisch IP-Adresse, Subnetzmaske, Gateway und meist DNS-Server zu. | Eine fehlende Zuweisung kann zu `169.254.x.x` führen. |
| **APIPA (Automatic Private IP Addressing)** | Automatische IPv4-Link-Local-Adresse aus `169.254.0.0/16`. | Hinweis auf fehlgeschlagene DHCP-Zuweisung bei entsprechend konfiguriertem Client. |
| **DNS (Domain Name System)** | Übersetzt Hostnamen in IP-Adressen. | DNS-Fehler können wie ein WLAN-Ausfall aussehen. |
| **VLAN (Virtual Local Area Network)** | Logische Trennung von Netzwerksegmenten auf Layer 2. | Falsche Zuordnung kann DHCP oder interne Ressourcen blockieren. |
| **GPO (Group Policy Object)** | Gruppenrichtlinienobjekt zur zentralen Windows-Konfiguration. | Firmen-WLAN-Profile können zentral verteilt werden. |
| **MDM (Mobile Device Management)** | Zentrale Geräteverwaltung, z. B. Microsoft Intune. | Verteilt WLAN-Profile, Zertifikate und Sicherheitseinstellungen. |
| **Roaming** | Wechsel eines WLAN-Clients zwischen Access Points. | Bei Bewegung im Gebäude können kurze Unterbrechungen auftreten. |

**Quellen:** [Microsoft – WLAN-Fehlersuche](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting) · [Microsoft – 802.1X-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/802-1x-authentication-issues-troubleshooting)

## 3. WLAN-Anmeldung: Privat vs. Unternehmen

| Heim-WLAN (häufig) | Unternehmens-WLAN (häufig) |
|---|---|
| WPA2-/WPA3-Personal mit gemeinsamem WLAN-Passwort | WPA2-/WPA3-Enterprise mit 802.1X und individueller oder gerätebezogener Anmeldung |
| WLAN-Router bzw. AP prüft den gemeinsamen Schlüssel | AP/Controller leitet Authentifizierung häufig über RADIUS an NPS oder einen anderen Authentifizierungsdienst weiter |
| Falsches WLAN-Passwort kann Verbindungsaufbau verhindern | Abgelaufenes Zertifikat, Richtlinie oder falsche EAP-Konfiguration kann Verbindungsaufbau verhindern |

**EAP-TLS (Extensible Authentication Protocol – Transport Layer Security)** verwendet typischerweise Zertifikate. Bei geschützter 802.1X-Anmeldung muss der Client die Identität des richtigen Servers prüfen können. **Diese Prüfung niemals einfach abschalten**, um eine Verbindung zu erzwingen: Sonst kann ein betrügerisches Funknetz unter Umständen Zugangsdaten oder andere Informationen abgreifen.

**Quelle:** [Microsoft – EAP / Serverzertifikatsvalidierung](https://learn.microsoft.com/windows-server/networking/technologies/extensible-authentication-protocol/network-access?tabs=eap-tls%2Cserveruserprompt-eap-tls%2Ceap-sim)

## 4. Fehleraufnahme und Eingrenzung

**Fragen an den Benutzer:** Seit wann? Exakte Windows-Meldung? Ist `Firma-Intern` sichtbar? Ist eine Verbindung möglich? Bricht sie später ab? Nur dieser Laptop oder mehrere? Nur an einem Ort? War ein Update, Kennwortwechsel oder Gerätewechsel vorausgegangen? Funktioniert LAN? Besteht gerade eine Fernwartungssitzung über das betroffene WLAN?

| Symptom | Erster Verdacht | Nächster Test |
|---|---|---|
| Kein WLAN-Schalter / kein Adapter sichtbar | Hardware, Funk deaktiviert, Treiber oder Dienst | Geräte-Manager, `Get-NetAdapter`, `Get-Service WlanSvc` |
| WLAN aktiv, aber Firmen-SSID fehlt | Funkabdeckung, Frequenzband, AP, Richtlinie | Sichtbare Netze, AP-Vergleich, Nachbarclient |
| SSID sichtbar, Verbindung scheitert | WLAN-Profil, WPA-/802.1X-Anmeldung | Exakte Meldung, WLAN-Bericht, WLAN-AutoConfig-Log |
| WLAN verbunden, `169.254.x.x` | Möglicherweise DHCP-Fehler | `ipconfig /all`, DHCP/VLAN-Pfad prüfen |
| WLAN verbunden, IP plausibel, Website lädt nicht | DNS, Gateway, Proxy, Firewall oder Zielsystem | Gateway, DNS und konkreten Dienst gezielt prüfen |
| Abbrüche nur in einem Gebäudeabschnitt | Funkqualität, AP, Roaming, Interferenzen | BSSID/Kanal/Signal und AP-Logs vergleichen |
| Mehrere Nutzer betroffen | AP, Controller, RADIUS/NPS, DHCP, Netzwerksegment | Infrastruktur-Eskalation mit betroffenen SSIDs/APs |

**Achtung:** Ein Ausfall der Internetverbindung kann mit intaktem Firmen-WLAN einhergehen. Ebenso kann eine Website ausfallen, obwohl der restliche Netzwerkzugang funktioniert.

## 5. Zugriffsvoraussetzungen: Von wo kann der Support diagnostizieren?

| Situation | Zugriff | Vorgehen und Grenzen |
|---|---|---|
| Benutzer ist noch am Windows-Desktop | Teams-Bildschirmfreigabe / Schnellhilfe, falls noch Netz verfügbar | WLAN-Symbol und Fehlermeldung gemeinsam ansehen. |
| WLAN getrennt, aber LAN angeschlossen | Remoteverwaltung via kabelgebundenem Netz, wenn freigegeben | Client-Befehle ausführen, ohne den problematischen WLAN-Pfad vorauszusetzen. |
| Laptop außerhalb der Firma, WLAN ausgefallen | Telefonischer Support / Vor-Ort-Diagnose | Nutzer führt lesende Tests lokal aus; keine Fernverbindung über das ausgefallene WLAN erwarten. |
| Zentrale Infrastruktur betroffen | AP-/WLAN-Controller-/RADIUS-Management durch berechtigte IT | AP-Verbindungsstatus, AAA-/NPS-Logs, VLAN und DHCP prüfen. |
| WLAN-Profil zentral verwaltet | GPO / MDM (z. B. Intune) | Zugewiesenes Profil und Zertifikate mit berechtigtem Administrationskonto prüfen. |

**Wichtig:** Ein WLAN-Adapter darf während einer darüber laufenden Remoteverbindung nicht unüberlegt deaktiviert, zurückgesetzt oder der Treiber entfernt werden. Die Supportsitzung kann sofort abbrechen.

## 6. Diagnose-Entscheidungsbaum

![RB-009 – Diagnose-Entscheidungsbaum](assets/rb009_diagnosebaum.svg)

**Textalternative:** Adapter funktionsfähig? → SSID sichtbar? → WLAN-Anmeldung erfolgreich? → DHCP/IP korrekt? → Gateway/DNS/Ziel erreichbar? → gezielt beheben und testen. Einzelne Schritte können bei offensichtlichem Mehrbenutzer-/AP-Ausfall parallel untersucht werden.

## 7. Lesende Clientdiagnose: Adapter und WLAN

**Ausführungsort:** Betroffener Windows-11-Client, in dessen aktiver Benutzer- oder Administrationssitzung; PowerShell. Einige `netsh`-Abfragen benötigen erhöhte Rechte oder können von Unternehmensrichtlinien eingeschränkt sein.

### A – Adapter und WLAN-Dienst prüfen

```powershell
# Get-NetAdapter listet die Netzwerkschnittstellen auf.
# Select-Object beschränkt die Darstellung auf Name, Status,
# Hardwarebeschreibung und gemeldete Verbindungsgeschwindigkeit.
Get-NetAdapter |
    Select-Object Name, Status, InterfaceDescription, LinkSpeed

# Prüft den Windows-Dienst für die automatische WLAN-Konfiguration.
# Dieser heißt intern WlanSvc (WLAN AutoConfig).
Get-Service -Name 'WlanSvc' |
    Select-Object Name, Status, StartType
```

**Interpretation:** `Status = Up` beim Adapter beweist noch nicht den Internetzugang. Ein nicht laufender `WlanSvc` kann dazu führen, dass WLAN-Funktionen nicht verfügbar sind. **Nicht automatisch einen deaktivierten Unternehmensdienst starten**, ohne zu klären, ob dies durch Richtlinien vorgegeben wurde.

### B – WLAN-Verbindungszustand abfragen

```powershell
# netsh ist ein Windows-Kommandozeilenwerkzeug, kein PowerShell-Cmdlet.
# 'wlan' wählt die WLAN-Funktionen aus.
# 'show interfaces' zeigt unter anderem SSID, BSSID, Signal, Funktyp.
netsh wlan show interfaces

# Zeigt sichtbare Funknetze mit BSSID, Kanal und Signalwerten.
# mode=bssid erweitert die Detailansicht um einzelne Funkzellen.
netsh wlan show networks mode=bssid

# Zeigt installierte WLAN-Treiber- und Fähigkeitsinformationen.
netsh wlan show drivers

# Listet lokal gespeicherte WLAN-Profile (keine Kennwörter ausgeben).
netsh wlan show profiles
```

**Auswertung:** Ist die korrekte **SSID** verbunden? Welcher **BSSID** (Access Point) versorgt den Client? Wie stark ist das Signal? Liegt ein Netz auf 2,4, 5 oder 6 GHz? Der angezeigte Signalwert ist nur ein Hinweis; daraus allein lässt sich keine exakte Ursache oder Durchsatzrate ableiten.

**Datenschutz:** Namen von Firmen-WLANs, BSSIDs/MAC-Adressen und Profildaten können intern vertraulich sein. Niemals ungeschwärzt auf einer öffentlichen Website veröffentlichen. **Nicht** `key=clear` verwenden, um WLAN-Schlüssel offenzulegen.

**Quelle:** [Microsoft Learn – netsh wlan](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/netsh-wlan)

## 8. Den WLAN-Verlaufsbericht und Ereignisse untersuchen

### A – WLAN-Bericht erzeugen

**Ausführungsort:** Betroffener Windows-Client, in einer als Administrator gestarteten PowerShell oder Eingabeaufforderung. Der Befehl erstellt eine **Datei** und ist damit nicht völlig lesend; er setzt aber keine Netzwerkkonfiguration zurück.

```powershell
# Erstellt einen HTML-Bericht zu jüngsten WLAN-Verbindungen.
# Der Befehl zeigt nach Abschluss den vollständigen Speicherpfad.
netsh wlan show wlanreport
```

Der Bericht enthält unter anderem WLAN-Sitzungen, Verbindungsabbrüche und Adapterinformationen. Microsoft beschreibt, dass er WLAN-Ereignisse aus **den letzten drei Tagen** gruppiert. Er wird im Browser geöffnet; Speicherort aus der Ausgabe übernehmen, statt einen festen Pfad vorauszusetzen.

**Besonders prüfen:** Uhrzeit des Fehlversuchs, Verbindungsversuch, Trennungsgrund, Adapter/Treiber, wiederholte Roaming-Ereignisse. Der Bericht kann personenbezogene bzw. Netzwerkkennungen enthalten.

**Quelle:** [Microsoft Support – Drahtlosnetzwerkbericht analysieren](https://support.microsoft.com/de-de/windows/experience/connectivity-networking/analyze-the-wireless-network-report)

### B – WLAN-AutoConfig-Ereignisse auslesen

**Ausführungsort:** Derselbe Client, mit Berechtigung zum Lesen des entsprechenden Windows-Ereignisprotokolls.

```powershell
# Definiert den Namen des WLAN-Betriebsprotokolls.
$protokoll = 'Microsoft-Windows-WLAN-AutoConfig/Operational'

# Legt den Beginn des Untersuchungszeitraums fest:
# zwei Stunden vor dem aktuellen Zeitpunkt.
$start = (Get-Date).AddHours(-2)

# Filtert Ereignisse nach Log und Startzeit.
# MaxEvents begrenzt die Anzahl zurückgegebener Einträge.
Get-WinEvent -FilterHashtable @{
    LogName   = $protokoll
    StartTime = $start
} -MaxEvents 30 |
    Select-Object TimeCreated, Id, LevelDisplayName, Message
```

**Interpretation:** Zeitstempel mit dem Verbindungsversuch des Benutzers abgleichen. Die **Ereignis-ID allein** reicht oft nicht für eine Ursache: Beschreibung/Reason Code und Kontext prüfen. Es kann sein, dass das Protokoll deaktiviert oder kein Zugriff möglich ist.

**GUI-Alternative:** `eventvwr.msc` öffnen → **Anwendungs- und Dienstprotokolle → Microsoft → Windows → WLAN-AutoConfig → Operational**.

**Quelle:** [Microsoft Learn – fortgeschrittene WLAN-Diagnose](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting)

## 9. Nach erfolgreicher WLAN-Anmeldung: IP/DHCP/DNS prüfen

**Ausführungsort:** Betroffener Client. Die folgenden Befehle lesen Konfigurations- und Netzwerkstatus, verändern die Netzwerkkonfiguration aber nicht.

```powershell
# Zeigt IP-Adressen, Standardgateway und konfigurierte DNS-Server.
Get-NetIPConfiguration

# Zeigt zusätzlich DHCP-Status, IP-Lease und Adapterdetails.
# ipconfig ist ein externes Windows-Programm.
ipconfig /all

# Testet Namensauflösung für einen bekannten internen Dienst.
# 'intranet.firma.example' ist ein Platzhalter, kein reales Ziel.
Resolve-DnsName 'intranet.firma.example'

# Testet die TCP-Verbindung zum tatsächlichen internen Ziel.
# -ComputerName bezeichnet das Ziel, -Port den TCP-Dienst.
# Beispiel-IP aus dem Dokumentationsnetz – in der Praxis ersetzen.
Test-NetConnection -ComputerName '192.0.2.20' -Port 443
```

| Befund | Interpretation und nächster Schritt |
|---|---|
| Adapter hat `169.254.x.x` | Unter automatischer IPv4-Konfiguration Hinweis auf nicht erfolgreiche DHCP-Zuweisung; DHCP, VLAN und AP-Uplink prüfen. |
| Gültige IP, aber kein Standardgateway | Je nach Netzwerkdesign fehlt möglicherweise eine Route aus dem lokalen Subnetz. |
| Gateway erreichbar, Name wird nicht aufgelöst | DNS-Einstellungen, DNS-Server oder Namensbereich prüfen. |
| DNS löst auf, Zielport nicht erreichbar | Routing, Firewall, Zielsystem oder Anwendung untersuchen; DNS allein beweist keinen erfolgreichen Dienstzugriff. |
| Ein einzelner Dienst ist nicht erreichbar | Zielserver, Proxy, VPN oder dienstspezifische Sperre prüfen; WLAN kann intakt sein. |

**Hinweise:** `169.254.x.x` betrifft **IPv4**; ein System kann gleichzeitig eine funktionierende IPv6-Verbindung besitzen. ICMP-Ping kann durch Firewallrichtlinien blockiert sein. Der Windows-Hinweis „Kein Internet“ basiert auf einer Erreichbarkeitsprüfung und beweist nicht automatisch, dass jedes interne Netzwerkziel unerreichbar ist.

## 10. Unternehmens-WLAN: 802.1X, Zertifikate und NPS (L2)

Bei einem Firmen-WLAN mit **WPA2/WPA3-Enterprise** kann eine Verbindung bereits in der Zugangskontrolle scheitern, bevor der Client eine betriebliche IPv4-Adresse bekommt.

**Vereinfachter Ablauf:**

```text
Client mit 802.1X-Profil/Zertifikat
    │ Identität / EAP-Anmeldung
    ▼
Access Point bzw. WLAN-Controller
    │ RADIUS-Anfrage
    ▼
RADIUS-/NPS-Server (+ ggf. AD / PKI)
    │ Zugang erlaubt oder abgelehnt
    ▼
Zugriff auf zugewiesenes Netzwerk/VLAN
    │ DHCP und weitere Netzwerkdienste
    ▼
Interne Ressourcen
```

**PKI (Public Key Infrastructure)** bezeichnet die Infrastruktur zum Ausstellen, Verwalten und Überprüfen digitaler Zertifikate.

### Typische Fehler

- Zertifikat abgelaufen, nicht vorhanden oder nicht vertrauenswürdig.
- Serverzertifikat passt nicht zu dem im WLAN-Profil erwarteten Authentifizierungsserver.
- Benutzer/Computer nicht für die Netzwerkrichtlinie autorisiert.
- Falsche EAP-Methode, veraltetes verwaltetes WLAN-Profil oder fehlerhafte Zertifikatsverteilung.
- AP/Controller kann den RADIUS-Server nicht erreichen.
- Nach erfolgreicher Authentifizierung falsches VLAN oder fehlender DHCP-Zugriff.

### Serverseitige NPS-Ereignisse

| Ereignis | Bedeutung im NPS-Sicherheitsprotokoll |
|---|---|
| `6272` | Der Network Policy Server hat Netzwerkzugriff gewährt. |
| `6273` | Der Network Policy Server hat Netzwerkzugriff verweigert. |
| `6274` | Eine Anfrage wurde vom NPS verworfen. |

**Nur mit entsprechender Berechtigung** werden Uhrzeit, Benutzer/Computer, Anfrager, passende Richtlinie und **Reason Code** auf dem NPS verglichen. Die Ereignisse sind nur bei entsprechender Auditkonfiguration verfügbar. Ist die Organisation nicht auf Microsoft NPS aufgebaut, gelten die Logs ihrer tatsächlichen RADIUS-/WLAN-Lösung.

**Quelle:** [Microsoft Learn – Problembehandlung bei 802.1X](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/802-1x-authentication-issues-troubleshooting) · [Microsoft Learn – NPS-Fehlersuche](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-network-policy-server)

**Sicherheitsgrenze:** Keine Zertifikatsvalidierung deaktivieren, EAP-Methode auf unsicher umstellen oder Unternehmens-WLAN-Zugangsdaten „testweise“ über unbekannte WLANs eingeben. Fehler an Richtlinien/Zertifikaten an die zuständige L2-/Netzwerk-/Identity-Abteilung eskalieren.

## 11. Ursachenbezogene Lösungen statt pauschaler Resets

| Nachgewiesener Befund | Gezielte Maßnahme | Risiko/Grenze |
|---|---|---|
| WLAN per Hardwaretaste/Flugmodus deaktiviert | Nach Rückfrage einschalten | Unternehmensrichtlinien beachten. |
| Nur bestimmter Gebäudeteil ohne WLAN | AP-/Controllerstatus und Verkabelung prüfen lassen | AP-Neustart betrifft ggf. viele Clients; L2/Netzwerkteam. |
| WLAN-Profil nach Richtlinienwechsel veraltet | Version und Zuweisung über GPO/MDM klären; autorisiert neu bereitstellen | Ein blind gelöschtes Profil kann Zugang endgültig unterbrechen. |
| Zertifikat ungültig oder fehlt | Zertifikatskette, Gültigkeit, Zuweisung prüfen; PKI-/MDM-Team einschalten | Serverprüfung nicht abschalten. |
| DHCP fehlgeschlagen | Zuständigen Scope, VLAN, DHCP-Relay und AP-Uplink prüfen | Keine unkoordinierten statischen IPs vergeben. |
| DNS falsch | Zuweisungsquelle (DHCP/VPN/MDM) korrigieren lassen | Keine öffentlichen DNS-Server als pauschale Lösung für interne Namen. |
| Funkabbrüche/geringes Signal | BSSID/Kanal/Signalverlauf, Störungen, Roaming und AP-Konfiguration korrelieren | Ursache erst nach Messung benennen. |
| Bekannter Treiberfehler nach Update | Herstellerfreigegebene Version/erlaubten Rollback prüfen | Änderung ggf. mit Neustart/Verbindungsabbruch. |

**Erst nach Freigabe und Sicherung der Diagnosebasis:** Änderungen an Adapter, Netzprofil, Treiber oder Netzwerkstack erwägen. Microsoft empfiehlt, WLAN-Profile, Treiber und Netzwerkstack nicht vorschnell zurückzusetzen, weil dabei wichtige Diagnoseinformationen verloren gehen können.

**Quelle:** [Microsoft Learn – WLAN-Fehlersuche, Grundlagen vor Reset](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting)

## 12. Erfolgskontrolle – „Verbunden“ allein reicht nicht

- [ ] Geplante SSID und zulässiger Authentifizierungsmodus sind verbunden.
- [ ] Bei Unternehmens-WLAN: Anmeldung an der vorgesehenen Infrastruktur erfolgreich.
- [ ] IP-Konfiguration ist für das Zielnetz plausibel (bei Bedarf IPv4 **und** IPv6 prüfen).
- [ ] Benötigter interner Dienst und gegebenenfalls Internetzugang funktionieren.
- [ ] Verbindung bleibt in der relevanten Alltagssituation stabil (Standort, Bewegung, Energiesparzustand).
- [ ] Bei mehreren Betroffenen den Zustand eines weiteren Clients prüfen.
- [ ] Abweichungen, Eingriffe und Restrisiken dokumentieren.

## 13. Wann wird von L1 an L2 eskaliert?

**L1:** Fehlerbild aufnehmen, Clientstatus, WLAN-Funknetz, IP-/DNS-Informationen und WLAN-Bericht prüfen; freigegebene Standardmaßnahmen durchführen; Benutzer verständlich informieren.

**L2/Netzwerk-/Identity-Team:** AP-/Controllerstörungen, NPS/RADIUS-, 802.1X-, Zertifikats-, VLAN-, DHCP-Relay-, Routing-, Firewall- und standortweite Probleme; wiederkehrende Roaming-Fehler; Änderungen an verwalteten WLAN-Profilen oder Treibern.

**Eskalationspaket:** Zeitpunkt mit Zeitzone, Clientname, OS-Version, SSID/BSSID (intern vertraulich), betroffener Standort/AP, Verbindungsstatus, Fehlertext, IP-Konfiguration, anonymisierter WLAN-Bericht, Ereignisse, Vergleichsgerät, Änderungen, Auswirkungen und notwendige Freigaben.

## 14. Muster-Ticketkommentar (fiktiv)

**Ticket:** INC-009 – Firmen-WLAN verbindet, aber interne Ressourcen nicht erreichbar.

**Fehlerbild:** Windows-11-Laptop `NB-023` zeigt `Firma-Intern` als verbunden. Unternehmensanwendungen sind nicht erreichbar; ein Kollege am selben Standort ist nicht betroffen.

**Diagnose:** WLAN-Adapter und Anmeldung erfolgreich. `ipconfig /all` zeigte eine automatische IPv4-Adresse aus `169.254.0.0/16` statt des erwarteten Unternehmensnetzes. Nächste Prüfung des DHCP-/VLAN-Pfads veranlasst.

**Ursache:** **Nicht abschließend nachgewiesen.** Verdacht auf fehlgeschlagene DHCP-Zuweisung; DHCP-Server, WLAN-VLAN, Relay oder AP-Uplink müssen geprüft werden.

**Maßnahme:** Diagnoseinformationen und Zeitpunkt dokumentiert; an zuständiges L2-Netzwerkteam mit Befund übergeben. Kein WLAN-Profil gelöscht und keine sicherheitsrelevanten Einstellungen geändert.

**Ergebnis:** Noch offen – nicht als „gelöst“ markiert.

**Status:** Eskaliert. *Alle Angaben sind fiktive Lernwerte, keine tatsächlich ausgeführte Diagnose.*

## 15. Lernkontrolle und technische Quellen

### Wissensfragen

1. Wofür stehen SSID und BSSID, und was ist der Unterschied?
2. Was bedeutet eine IPv4-Adresse aus `169.254.0.0/16` bei aktivem DHCP?
3. Welche Informationen liefert `netsh wlan show wlanreport`?

### Verständnisfragen

1. Warum beweist die Anzeige „WLAN verbunden“ keinen funktionierenden DNS-Zugriff?
2. Warum darf bei 802.1X die Zertifikatsprüfung nicht für einen schnellen Test deaktiviert werden?
3. Warum sollte ein WLAN-Profil vor der Sicherung des Fehlerzustands nicht pauschal gelöscht werden?

### Diagnoseaufgabe

**Neues fiktives Szenario:** Drei Mitarbeiter an derselben Gebäudeecke verlieren während Videokonferenzen regelmäßig das WLAN. An einem anderen Flur passiert dies nicht. IP-Adressen sind nach erneuter Verbindung korrekt. **Welche Informationen würdest du zuerst vergleichen, bevor du die WLAN-Adaptertreiber austauschst?**

### Offizielle Quellen und Verwendung

| Quelle | Wofür im Runbook verwendet? |
|---|---|
| [Microsoft Learn – Advanced troubleshooting wireless network connectivity](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting) | Symptomorientierte WLAN-Diagnose, Logs, BSSID, Warnungen vor Resets |
| [Microsoft Support – WLAN-Probleme beheben](https://support.microsoft.com/de-de/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows) | Windows-11-Grunddiagnose, DHCP/IP und Netzwerkreset als spätere Maßnahme |
| [Microsoft Support – Drahtlosnetzwerkbericht](https://support.microsoft.com/de-de/windows/experience/connectivity-networking/analyze-the-wireless-network-report) | `netsh wlan show wlanreport`, HTML-Auswertung und Zeitraum |
| [Microsoft Learn – netsh wlan](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/netsh-wlan) | Syntax der WLAN-Kommandozeilenbefehle |
| [Microsoft Learn – 802.1X-Authentifizierung untersuchen](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/802-1x-authentication-issues-troubleshooting) | WLAN-AutoConfig, NPS-Ereignisse, Reason Codes |
| [Microsoft Learn – Extensible Authentication Protocol](https://learn.microsoft.com/windows-server/networking/technologies/extensible-authentication-protocol/network-access?tabs=eap-tls%2Cserveruserprompt-eap-tls%2Ceap-sim) | EAP, Zertifikatsvalidierung und Sicherheitsgrenzen |
| [Microsoft Learn – NPS-Problembehandlung](https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-network-policy-server) | Netzwerkrichtlinienserver und NPS-Auditing |

**Recherche- und Prüfdatum:** 08.11.2026. **Praktische Validierung:** Ausstehend. **Veröffentlichung:** Nur mit anonymisierten Beispielwerten und ohne interne WLAN-Profile, Kennwörter oder Zertifikatsschlüssel.
