# RB-023 – Praxis-Runbook: Dockingstation funktioniert nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Umgebung:** Windows 11, Notebook + kabelgebundene USB-C-, Thunderbolt-/USB4- oder DisplayLink-Dockingstation  
**Level:** L1 (Erstdiagnose) / L2 (vertiefte Diagnose, freigegebene Änderungen)  
**Version:** 1.0 · **Stand:** 22.11.2026 · **Status:** recherchiert; Praxisvalidierung ausstehend

> **Einsatzregel:** Nur das tatsächlich ausgefallene Funktionsmerkmal diagnostizieren. Vor Kabeltrennung, Dock-Power-Cycle und Netzwerkunterbrechung erst Nutzerzustimmung, gespeicherte Arbeit und nötige Freigaben prüfen. Herstelleranleitung für das **konkrete Modell** hat Vorrang.

![RB-023 – Technischer Diagnosebaum](assets/rb023_diagnosebaum.svg)

## 1. Ticketaufnahme und Risikoprüfung (L1)

**Meldung:** „Dockingstation funktioniert nicht.“ **Diese Meldung reicht für keine Ursachenfeststellung.**

- [ ] Betroffene Person/Arbeitsplatz, Gerätetyp, Dockhersteller und Modell aufnehmen.
- [ ] Zeitpunkt und letztes funktionierendes Setup notieren (seit wann, was geändert?).
- [ ] Welche Funktionen fallen aus: **Laden/PD**, **USB**, **Video**, **LAN**, **Audio**?
- [ ] Welche Funktionen sind **nachweislich intakt**? Nicht nur „Dock-LED leuchtet“.
- [ ] Sind laufende Netzverbindungen/Dateiübertragungen/Meetings betroffen? Testunterbrechung erlauben lassen.
- [ ] Visuelle Sicherheitsprüfung: Stecker-/Kabelbruch, Hitze, Brandgeruch, Flüssigkeit, Verformung? **Bei Gefahr abbrechen und Hardwareprozess auslösen.**

### Erste Bestandsmatrix (ausfüllen)

| Funktion | Direkt am Notebook | Über Dock | Bemerkung / Beobachtung |
|---|---|---|---|
| Notebook laden | ☐ Ja ☐ Nein ☐ N. a. | ☐ Ja ☐ Nein | Akkuanzeige/PD-Hinweis |
| USB-Maus/Tastatur | ☐ Ja ☐ Nein | ☐ Ja ☐ Nein | USB-Port / Funkempfänger |
| Externer Monitor | ☐ Ja ☐ Nein ☐ N. a. | ☐ Ja ☐ Nein | Monitor-Eingang, `Win + P` |
| Ethernet/LAN | ☐ Ja ☐ Nein ☐ N. a. | ☐ Ja ☐ Nein | Link + IP nicht gleich Anwendung |
| Dock-Audio | ☐ Ja ☐ Nein ☐ N. a. | ☐ Ja ☐ Nein | Nur falls betroffen |

„N. a.“ nur bei fehlender kompatibler Direktanschlussmöglichkeit; **kein erzwungener Adaptertest**.

## 2. Aufstellort, Stromversorgung und Hostverbindung prüfen (L1)

- [ ] Dock **Originalnetzteil/freigegebenes kompatibles Netzteil** angeschlossen? Stromzufuhr intakt?
- [ ] Dock-Leistungsanzeige **laut jeweiligem Modellhandbuch** interpretieren.
- [ ] Hostkabel sitzt an der richtigen Buchse **des Docks** und an einem **geeigneten Hostport** des Notebooks.
- [ ] USB-C-Steckerform nicht mit DP-Alt-Mode-, Thunderbolt-, USB4- oder Power-Delivery-Unterstützung gleichsetzen.
- [ ] Hostkabel ist für die jeweilige Funktion geeignet (nicht jedes USB-C-Kabel überträgt Video bzw. jede Leistung).
- [ ] Sichtbaren Kabel-/Portschaden dokumentieren; beschädigte Komponenten **nicht weiterverwenden**.
- [ ] Wenn nachgefragt: Dock-/Notebook-Kompatibilität in den **konkreten Hersteller-Spezifikationen** bestätigen.

**Befundregel:** „Notebook lädt“ belegt allein weder USB-Daten noch externe Monitore oder LAN. „Dock-LED an“ bestätigt je nach Modell nicht alle Teilkomponenten.

## 3. Direktvergleich durchführen (L1)

1. **Genau eine ausgefallene Funktion** auswählen, z. B. USB-Maus oder Display.
2. Dieselbe Peripherie **direkt am Notebook** und am Dock vergleichen (wenn ein kompatibler Direktanschluss möglich ist).
3. Wenn direkt **nicht** funktionsfähig: zuerst Gerät, direkten Hostanschluss oder das zuständige Spezial-Runbook prüfen; Dock bleibt nur eine von mehreren Hypothesen.
4. Wenn direkt **funktionsfähig**, über Dock **nicht**: Dock-/Hostkabel-/Dock-Port-/Protokollpfad eingrenzen.
5. Nächstes A/B nur mit **einem** veränderten Faktor: anderer geeigneter Hostport, freigegebenes kompatibles Hostkabel, anderer Dockport oder kompatibles Vergleichsdock.
6. Vorher/Nachher-Zustand und **genaue** Änderung dokumentieren.

**Keine Beweiskraft:** „Mit einem beliebigen USB-C-Kabel klappt Video nicht“ ohne Nachweis, dass das Kabel und der Port Video unterstützen.

## 4. Welche Funktion ist ausgefallen? (L1)

### A. Alles oder fast alles ausgefallen

- [ ] Strom/Netzteil, Hostverbindung und Sicherheitszustand nach Abschnitt 2 geprüft.
- [ ] Falls freigegeben: Dock **nach modellbezogener Herstellerprozedur** kontrolliert stromlos schalten und neu verbinden; vorher laufende Arbeit sichern.
- [ ] A/B mit geeignetem Hostkabel, passendem Port oder bekannt kompatiblem Vergleichsdock.
- [ ] Wenn weiterhin komplett ohne Funktion oder gefährlicher Zustand: **L2/Hardwaretausch**.

### B. Nur externe Monitore betroffen

- [ ] Monitor OSD/Strom/Input; funktioniert derselbe Monitor direkt?
- [ ] Windows `Win + P` und **Einstellungen → System → Anzeige**, Erkennen/Erweitern.
- [ ] Dock-Technik identifiziert: **DP Alt Mode**, **Thunderbolt/USB4**, **DisplayLink**?
- [ ] Bei DisplayLink-Dock: Ist die **herstellerseitig vorgesehene Software** auf dem verwalteten Client vorhanden? **L2/Endpoint** für Installation.
- [ ] Unterstützte Monitoranzahl, Auflösung und Frequenz im Modellhandbuch prüfen.
- [ ] Tiefendiagnose nach **RB-022 – Monitor wird nicht erkannt**.

### C. Nur USB-Geräte betroffen

- [ ] Gerät direkt am Notebook: Ja/Nein? Anderen geeigneten Dock-USB-Port testen.
- [ ] USB-Hub/USB-Controller im Geräte-Manager auf Warnungen prüfen.
- [ ] Bei Bedarf andere Peripherie **nach Freigabe** vorübergehend trennen.
- [ ] **Keine** Treiberdeinstallation oder Sperrrichtlinien-Änderung auf Verdacht.
- [ ] Einzelfall nach **RB-024 – USB-Gerät, Maus oder Tastatur ausgefallen**.

### D. Nur LAN über Dock betroffen

- [ ] Kabel, Dock-RJ45, Netzwerkdose/Switchport, Linkanzeige.
- [ ] Dock-Ethernetadapter in `Get-NetAdapter` bzw. Geräte-Manager sichtbar? `Up` oder `Disconnected`?
- [ ] Wenn Link vorhanden: **Get-NetIPConfiguration**, IP/Gateway/DNS und passende Netzvorgaben prüfen.
- [ ] Link/IP ok, Ziel nicht: Netzwerk-/DNS-/Authentifizierungsdiagnose, ggf. **RB-010** und Netzwerkteam.
- [ ] **Niemals** Portauthentifizierung, VLAN- oder Sicherheitsrichtlinien unkoordiniert umgehen.

### E. Nur Laden/PD betroffen

- [ ] Unterstützt der Notebook-Hostport Laden über die Dock-Schnittstelle?
- [ ] Netzteil und Dock leisten die vom Hersteller vorgesehenen Leistungen; Kabel passend?
- [ ] Laden mit freigegebenem Original-Notebooknetzteil als Vergleich.
- [ ] Bei Temperaturwarnung oder Schäden **Hardwareprozess**.

## 5. Windows-Status und PowerShell (lesend, L1/L2)

```powershell
# Aktuell präsente USB-Geräte inkl. Status. Keine Änderungen.
Get-PnpDevice -Class USB -PresentOnly |
  Select-Object Status, FriendlyName, InstanceId

# Monitorinstanzen – bestätigt noch kein sichtbares Bild!
Get-PnpDevice -Class Monitor -PresentOnly |
  Select-Object Status, FriendlyName, InstanceId

# Netzwerkadapter und Linkstatus ansehen.
Get-NetAdapter |
  Select-Object Name, InterfaceDescription, Status, LinkSpeed

# IP-/Gateway-/DNS-Konfiguration ansehen.
Get-NetIPConfiguration

# Gerätetypen mit PnP-Fehler-/Warnstatus erfassen.
Get-PnpDevice -PresentOnly -Status ERROR,DEGRADED,UNKNOWN |
  Select-Object Class, Status, FriendlyName, InstanceId
```

**Interpretationshinweise:**

- `Up` für den Netzwerkadapter bedeutet **nicht** automatisch funktionierendes DHCP/DNS/Routing oder Anwendungserreichbarkeit.
- Keine eindeutige Dock-„Gesamtinstanz“ voraussetzen; manche Funktionen sind einzelne USB-/Grafik-/Netzwerkgeräte.
- `Get-PnpDevice` kann je nach Plattform/Windows-Version unterschiedliche Klasseneinträge anzeigen. Fehlende Klassen nicht als definitive Hardwarediagnose verkaufen.
- In Tickets **nur notwendige** Gerätekennungen übernehmen und personenbezogene Identifikatoren vermeiden.

## 6. Gezielt beheben – ausschließlich nach Befund (L1 → L2)

| Belastbarer Befund | Maßnahme / verantwortliche Stelle | Beweis für Erfolg |
|---|---|---|
| Hostkabel beschädigt oder A/B-Test reproduzierbar negativ | Geeignetes freigegebenes Kabel tauschen (L1 nach Vorgabe) | Alle benötigten Funktionen stabil |
| Falscher Hostport ohne erforderliche Funktionen | Geeigneten kompatiblen Port nutzen (L1) | Video/USB/PD je nach Soll-Anforderung |
| Netzteil/Leistung unpassend | Richtiges freigegebenes Netzteil (Hardware/IT) | Ladeverhalten ohne Warnung; übrige Pfade geprüft |
| Dock-Initialisierung nach Standby plausibel | Freigegebener Dock-Power-Cycle nach Handbuch | Reproduzierbarer Re-Test |
| DisplayLink-Dock, erforderliche Software fehlt | Endpoint/L2: genehmigt bereitstellen | Display erkannt und nutzbar |
| Treiber-/Firmwarefehler durch Befunde gestützt | L2: versionierter Change / OEM-Paket | Vorher-/Nachher-Test, ggf. Rollbackplan |
| Dock-LAN ohne Link bei intaktem Notebook | Kabel/Port/Switch und Dock-NIC isolieren | Link + IP + Unternehmensziel erreichbar |
| Dock an mehreren kompatiblen Hosts reproduzierbar defekt | L2/Hardware: Ersatz/Austausch | Mit Ersatzdock End-to-End-Betrieb |

**Sicherheitslinie:** Keine BIOS-/Firmware-Aktualisierung und keine pauschale Treiberentfernung im L1-Standardpfad. Kein Abziehen während laufender Firmwareupdates.

## 7. Abschlussprüfung: Alle benötigten Funktionen testen (L1)

- [ ] Notebook lädt wie vorgesehen **oder** Nichtladefähigkeit ist laut Hersteller für dieses Setup erwartbar/dokumentiert.
- [ ] USB-Maus/Tastatur funktional (Bewegung, Klick, Texteingabe) – nicht nur PnP-Eintrag.
- [ ] Gewünschte externe Monitore zeigen ein nutzbares, stabiles Bild; Displaymodus stimmt.
- [ ] Ethernet hat Link, korrekte IP-Konfiguration und erreicht einen **freigegebenen internen Testdienst** (nur falls LAN vorgesehen).
- [ ] Falls genutzt: Audio funktioniert über den gewünschten Ausgang / Eingang.
- [ ] Nach einem **vereinbarten** Ab-/Anstecken bzw. Wiederverbinden weiterhin funktionsfähig; keine unnötigen Stress-/Dauertests.
- [ ] Anwender bestätigt den funktionalen Soll-Zustand.
- [ ] Ursache, A/B-Befunde und konkrete Maßnahme im Ticket stehen; keine erfundene „Ursache“.

## 8. L2-Eskalation – weitergeben statt blind experimentieren

**Pflichtangaben:** Notebookmodell, Dockmodell, Netzteil-/Kabelkennung (soweit zulässig), Hostport, Monitoranzahl/Art, betroffene Pfade, Zeitpunkt/Änderungsbezug, LED-Verhalten laut Handbuch, Direkt-/Dock-/Kabel-Gegenproben, Windows-Gerätestatus, Netzwerkstatus, ausgeführte Maßnahmen und offene Hypothesen.

**L2-Fragen:** Ist Host-/Dockkompatibilität dokumentiert? Gibt es das passende OEM-Treiber-/Firmwarepaket und einen genehmigten Rollback-/Recoveryweg? Ist der Fehler an anderen kompatiblen Systemen reproduzierbar? Liegt eine Endpointrichtlinie oder Netzwerkportkontrolle vor? Ist Hardwaretausch effizienter und risikoärmer?

## 9. Beispiel-Ticketkommentar (rein fiktiv)

> **INC-023 | Situation:** Windows-11-Notebook lädt über Dock, aber USB-Maus, externe Anzeige und Dock-Ethernet fehlen. **Diagnose:** Maus und Monitor direkt am Notebook funktionsfähig. Docknetzteil und Modellkompatibilität geprüft. Mit freigegebenem Referenz-Hostkabel arbeiten die drei Dock-Datenfunktionen; mit dem bisherigen Hostkabel reproduzierbar nicht. **Maßnahme:** beschädigtes/ungeeignetes Hostkabel gegen spezifikationskonformes freigegebenes Kabel ersetzt. **Kontrolle:** USB-Eingabe, Bild im erweiterten Desktop, Dock-LAN und Ladefunktion mit Nutzer geprüft. **Status:** Beispielhaft gelöst; keine Treiber-/Firmwareänderung; fiktiver Schulungsfall, nicht real ausgeführt.

## 10. Referenzen, Lerncheck und Transparenz

**Herstellerdokumentation:**

- Microsoft: [USB-C-Probleme in Windows](https://support.microsoft.com/de-de/windows/hardware/usb/fix-usb-c-problems-in-windows)
- Microsoft: [Externe Monitore in Windows](https://support.microsoft.com/de-de/windows/hardware/display-graphics/troubleshoot-external-monitor-connections-in-windows)
- Dell: [Guide to Dell Docking Stations](https://www.dell.com/support/kbdoc/en-us/000124295/guide-to-dell-docking-stations)
- Lenovo: [Dock Guidelines and Troubleshooting](https://support.lenovo.com/uu/en/solutions/ht510459-dock-guidelines-and-troubleshooting)
- DisplayLink: [First Step Troubleshooting](https://support.displaylink.com/knowledgebase/articles/1179748-first-step-troubleshooting-for-devices-powered-by)
- Microsoft Learn: [Get-PnpDevice](https://learn.microsoft.com/en-us/powershell/module/pnpdevice/get-pnpdevice?view=windowsserver2025-ps), [Get-NetAdapter](https://learn.microsoft.com/en-us/powershell/module/netadapter/get-netadapter?view=windowsserver2025-ps), [Get-NetIPConfiguration](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipconfiguration?view=windowsserver2025-ps)

**Mini-Selbsttest:** „Dock lädt, aber kein Bild“ – warum ist das **kein Beweis für einen defekten Grafiktreiber**? „Nur Dock-LAN fehlt“ – welche drei Befunde brauchst du vor der DNS-Diagnose? „Der Austausch des Hostkabels behebt den Ausfall“ – wie stellst du sicher, dass der A/B-Test valide war?

**Status:** Recherchierte, noch **nicht praktisch validierte** Arbeitsanweisung. Modellhandbücher und Betriebsrichtlinien gehen vor. Keine realen Nutzer-/Clientdaten, keine tatsächlichen Supportmaßnahmen. Grafiken: Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.
