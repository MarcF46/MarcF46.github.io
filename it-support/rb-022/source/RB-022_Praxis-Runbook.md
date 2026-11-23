# RB-022 – Praxis-Runbook: Monitor wird nicht erkannt

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Zweck:** Sichere L1-Fehlereingrenzung für fehlende externe Anzeigen unter Windows 11.  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Auf Grundlage offizieller Herstellerquellen recherchiert; **praktische Validierung noch ausstehend**.

> **Arbeitsregel:** Nicht „kein Bild“ mit „Windows erkennt den Monitor nicht“ gleichsetzen. Signalquelle und Hardwarepfad zuerst, dann Windows-Einstellungen, erst anschließend Treiber/Firmware. Vor jedem Test nur **eine Variable** ändern und den Befund festhalten.

## 1. Erstaufnahme / Impact (L1)

- [ ] Nutzer, Arbeitsplatz, Zeitpunkt, Priorität, letzte Änderungen dokumentiert.
- [ ] Notebook-/Desktop-Modell, Monitor-Modell, ggf. Dock/Adapter/KVM notiert.
- [ ] Anzahl betroffener Anzeigen und genutzter Anschlüsse (HDMI/DP/USB-C) geklärt.
- [ ] **Exakte Beobachtung:** OSD aus, „Kein Signal“, „Out of range“, schwarzes Bild, nur dupliziert oder nur eine Windows-Anzeige?
- [ ] Wurde zuvor umgesteckt, ein Update installiert, das Gerät ab-/angedockt oder aus dem Standby geweckt?
- [ ] Benutzer über kurzfristige Bild-/Arbeitsunterbrechung informiert, Testfreigabe eingeholt.

**Sofortige Aufteilung:** Kein Monitormenü/kein Strom → zuerst Monitor-Hardware/Strom. Monitormenü funktioniert → Eingang und Signalweg. Windows erkennt bereits zwei Displays → primär Anzeigeaktivierung/Projektionsmodus prüfen.

## 2. Monitor und Signalweg ohne Systemeingriff (L1)

- [ ] Monitor-Strom/LED und **eigenes OSD-Menü** geprüft (nicht nur Laptopanzeige).
- [ ] Signalquelle am Monitor passend zur gesteckten Buchse gewählt (`HDMI 1`, `HDMI 2`, `DP`, `USB-C` etc.).
- [ ] Kabel sitzt beidseitig fest; Schäden/Verbiegen ausgeschlossen.
- [ ] Falls sicher verfügbar: geeignetes, funktionierendes **Ersatzkabel** im selben Anschlussweg getestet.
- [ ] Bei Desktop-PC geprüft, an **welchem** Videoadapter/Port das Kabel steckt.
- [ ] Test-Resultat nach **jeder** Einzeländerung protokolliert.

**Befund:** „Kein Signal“ bedeutet nur, dass der Monitor über den **gewählten Eingang** kein verwertbares Bildsignal darstellt. Ursache bleibt bis zur Gegenprobe offen.

## 3. A/B-Gegenprobe und Direktanschluss (L1)

| Test | Veränderung | Aussage bei Erfolg |
|---|---|---|
| A | Gleicher PC/Port/Monitor, nur geeignetes Ersatzkabel | Altes Kabel/Kontaktweg wird wahrscheinliche Ursache |
| B | Gleicher Monitor, freigegebener anderer Videoausgang | Alter Port/Portkonfiguration eingrenzen |
| C | Gleicher Monitor **direkt** am Notebook/PC statt über Dock | Fehler sitzt eher im Dock-/Adapter-/Hostport-Zweig |
| D | Anderer bekanntermaßen funktionierender Monitor am alten Signalweg | Eigenen Monitor vs. Ausgangsweg vergleichen |

- [ ] Nur technisch kompatible Varianten prüfen.
- [ ] Bei fehlendem geeigneten Testmaterial Befund **„nicht geprüft“** dokumentieren; keine Sicherheit vortäuschen.
- [ ] Stecker nicht gewaltsam lösen oder in inkompatible Buchsen drücken.

## 4. Windows-Projektionsmodus und Geräteerkennung (L1)

**Ausführungsort:** Lokaler Windows-11-Client. Die folgenden GUI-Schritte sind rückgängig zu machen; ursprüngliche Einstellungen zunächst notieren.

1. **`Windows + P`** → gewünschten Modus **Erweitern** oder **Duplizieren** wählen; „Nur PC-Bildschirm“ als mögliche Ursache prüfen.
2. **Einstellungen → System → Anzeige**: Sind `1` und `2` als Rechtecke sichtbar?
3. **Wenn mehrere vorhanden:** **Identifizieren**; prüfen, ob die gewünschte Anzeige deaktiviert ist und ob sich ein Fenster auf den zweiten Desktop verschieben lässt.
4. **Wenn zweiter Monitor fehlt:** **Mehrere Bildschirme → Erkennen** betätigen und Ergebnis festhalten.
5. **Wenn erkannt, aber kein nutzbares Bild:** Unterstützte Auflösung/Hz des betroffenen Monitors in **Erweiterte Anzeige** und Herstellerangaben prüfen; keine beliebigen höheren Frequenzen wählen.

| Beobachtung | Nächster Schritt |
|---|---|
| Windows zeigt zwei Monitore, einer wird nur nicht genutzt | Projektionsmodus und Anzeigeaktivierung korrigieren, sofort End-to-End-Test |
| Windows zeigt nur einen Monitor und OSD sagt „Kein Signal“ | Kabel, Eingang, Port, USB-C-/Dock-Fähigkeit durch A/B-Test prüfen |
| Monitor wird zeitweise erkannt | Kabelkontakt, Dock-/Sleep-Zustand, Signalqualität/Port, später Treiberpfad prüfen |
| Nur dritter Monitor nicht erkannt | Herstellergrenze (GPU, Dock, MST, Auflösung, Hz) prüfen lassen |

**Merke:** „Identifizieren“ zeigt die Zuordnung **bereits erkannter** Displays. „Erkennen“ versucht ein **fehlendes** Display zu finden.

## 5. Reinitialisierung nur nach Befund (L1)

Wenn das bisher funktionierende Setup plötzlich ausfällt, nach Rücksprache mit dem Anwender:

- [ ] **`Windows + Strg + Umschalt + B`** als kurzer Grafiktreiber-Reinitialisierungstest; Bildflackern/Signalton möglich.
- [ ] Falls ohne Erfolg und betrieblich möglich: geplanter Neustart nach Speichern offener Arbeit.
- [ ] Derselbe Testaufbau wird **unverändert** erneut geprüft.

**Nicht automatisch:** Treiber deinstallieren, Registry ändern, alle ausgeblendeten Monitore löschen oder Firmware flashen.

## 6. Lesende PowerShell-Prüfung (L1/L2)

```powershell
# Zeigt aktuell vorhandene PnP-Monitorinstanzen.
# OK ist KEIN Beweis für korrektes externes Videosignal.
Get-PnpDevice -Class Monitor -PresentOnly |
    Select-Object Status, Class, FriendlyName, InstanceId

# Zeigt aktuell vorhandene Grafikadapter.
Get-PnpDevice -Class Display -PresentOnly |
    Select-Object Status, FriendlyName, InstanceId

# Zeigt Treiberversion und vom System gemeldeten Videomodus.
# Nur lesen, nichts installieren oder zurücksetzen.
Get-CimInstance -ClassName Win32_VideoController |
    Select-Object Name, DriverVersion, VideoModeDescription
```

**Hinweis:** Geräteklassen und Treiberdaten können je nach Hardware abweichen. In einer Ticketkopie personenbezogene/geräteidentifizierende Angaben minimieren. Der **Geräte-Manager** ergänzt die Abfrage um eventuelle Warnsymbole und Fehlercodes.

## 7. USB-C / Dock / MST: spezielle Prüffragen (L1 → L2)

- [ ] Unterstützt **dieser konkrete USB-C-PC-Port** die benötigte Videoausgabe (**DP Alt Mode**/geeignetes Thunderbolt)? Nicht anhand der Steckerform annehmen.
- [ ] Unterstützen **Kabel**, Adapter, Monitor und Dock die benötigten Protokolle und Bandbreiten?
- [ ] **Direktanschluss** funktioniert, nur Dock-Zweig nicht? → Dockmodell, Hostport, Treiber/DisplayLink und Firmware durch L2 prüfen.
- [ ] Sind mehrere Monitore über DP-/USB-C-MST verbunden? Unterstützen Kette und Hardware diese Anzahl und Auflösungen?
- [ ] Ist ein einfacher HDMI-Splitter im Einsatz? Er dupliziert typischerweise, statt Windows zwei unabhängige Displays zu liefern.
- [ ] Sind **gleichzeitig** Dock-USB oder Dock-LAN gestört? → RB-023 als verknüpften Supportfall aufnehmen.

**Sicherheitsregel:** BIOS-, GPU-/Dock-Firmware- und Docktreiberänderungen nur durch zuständige Mitarbeiter und nach freigegebenem Verfahren.

## 8. Maßnahme nur nach nachweisbarem Befund

| Befund | Kontrollierte Maßnahme | Zielprüfung |
|---|---|---|
| OSD falscher HDMI/DP-Eingang | Richtigen Eingang auswählen | Bild und Windows-Anzeige sichtbar |
| A/B-Test isoliert Kabel | Geeignetes Kabel ersetzen | Bild und stabile Wiederverbindung |
| Windows hat zwei Displays, aber zweiten deaktiviert | `Windows + P → Erweitern` bzw. gewünschten Modus | Fenster auf externen Bildschirm verschieben |
| USB-C-Port ohne Video | Unterstützten Videoanschluss nutzen | Monitor über passenden Weg erkannt |
| Monitor nur über Dock gestört | Dock-/Portweg an L2 / RB-023 übergeben | Direkttest vs. Docktest dokumentiert |
| GPU-Treiberproblem plausibel | L2: Hersteller-/Endpointprozess für Rollback/Update | Nach genehmigter Änderung erneut testen |
| Verdacht auf Hardwaredefekt | Gesteuerten Kreuztausch, Hardwareticket | Reproduzierbarer Ausfall an kompatiblen Gegenkomponenten |

## 9. Erfolgskontrolle mit Benutzer (L1)

- [ ] Monitormenü und gewünschter Videoeingang stimmen.
- [ ] **Reales Bild** auf dem externen Monitor sichtbar, nicht nur ein PnP-Eintrag.
- [ ] `Einstellungen → System → Anzeige` zeigt die erwarteten Monitore; **Identifizieren** bestätigt Zuordnung.
- [ ] **Erweitern** oder vereinbarte Anzeigeart funktioniert; Fenster per Maus verschiebbar.
- [ ] Auflösung/Frequenz angemessen; nach Ab-/Anstecken bzw. Wiederverbindung im üblichen Nutzungskontext stabil.
- [ ] Ursache, durchgeführter Einzeltest und Nutzerbestätigung dokumentiert.

### Muster-Ticketkommentar (fiktiv)

> **INC-022 | Rückmeldung:** Externer Monitor am Windows-11-Notebook zeigte „Kein Signal“; OSD erreichbar. Kabel am Monitor an HDMI 1 angeschlossen, Eingang aber auf HDMI 2 gestellt. Eingang auf HDMI 1 geändert. Anschließend zwei Anzeigen unter Windows erkannt und `Erweitern` mit dem Anwender erfolgreich geprüft. **Ursache:** falsche Eingangsquelle. **Maßnahmen:** OSD-Eingang korrigiert, keine Treiber-/Firmwareänderung. **Status:** Beispielhaft gelöst; fiktiver Schulungsfall, nicht praktisch durchgeführt.

## 10. L2-Eskalation und Quellen

**Minimalpaket für L2:** Symptom inkl. OSD-/Windows-Befund, betroffener Nutzer/Client nach Unternehmensrichtlinie, Geräte-/Port-/Kabelkette, Treiberversion, Zeitpunkt/Änderungskontext, reproduzierbare A/B-Testmatrix, eindeutige oder verbleibende Hypothesen, Risiken, bereits ausgeführte und *nicht* ausgeführte Maßnahmen.

**Offizielle Herstellerquellen:**

- [Microsoft – Externe Monitorverbindungen behandeln](https://support.microsoft.com/de-de/windows/hardware/display-graphics/troubleshoot-external-monitor-connections-in-windows)
- [Microsoft – Mehrere Monitore in Windows](https://support.microsoft.com/de-de/windows/hardware/display-graphics/how-to-use-multiple-monitors-in-windows)
- [Microsoft – USB-C-Probleme behandeln](https://support.microsoft.com/de-de/windows/hardware/usb/fix-usb-c-problems-in-windows)
- [Microsoft Learn – Get-PnpDevice](https://learn.microsoft.com/en-us/powershell/module/pnpdevice/get-pnpdevice?view=windowsserver2025-ps)
- [Dell – USB-C ohne Monitorbild (modellbezogen)](https://www.dell.com/support/kbdoc/en-us/000326500/dell-monitor-usb-c-port-displays-no-video)
- [Dell – Guide to Docking Stations](https://www.dell.com/support/kbdoc/en-us/000124295/guide-to-dell-docking-stations)

**Transparenz:** Recherchierte L1-/L2-Anleitung, **keine** praktische Validierung des Falls in einer Produktivumgebung. Unternehmensrichtlinien und konkrete Gerätespezifikationen haben Vorrang.
