# RB-024 – Praxis-Runbook: USB-Gerät, Maus oder Tastatur ausgefallen

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Zielumgebung:** Windows 11, direkte USB-Geräte, USB-Hubs/Dockingstationen, USB-Funkempfänger und Bluetooth-HID-Geräte  
**Level:** L1 (Aufnahme, gefahrlose Gegenproben und bestätigte Standardmaßnahmen); L2 (Controller/Treiber, Energiekonfiguration, Richtlinien, Hardwaretausch bei Unklarheit)  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Status:** recherchiertes Runbook zur späteren praktischen Prüfung; noch nicht im Labor validiert.

> **Einsatzregel:** *Erst benennen, was ausgefallen ist, dann genau eine Variable ändern.* USB-Speicher sind **keine** harmlosen Eingabegeräte: Schreibvorgänge beenden, sichere Entfernung beachten. Sicherheitsrichtlinien nicht umgehen. Bei mechanischem Schaden, Überstromwarnung oder Überhitzung Tests abbrechen.

![RB-024 – technischer Diagnosebaum](assets/rb024_diagnosebaum.svg)

## 1. Ticketaufnahme und Auswirkungsprüfung (L1)

- [ ] Wer/wo betroffen? Hostmodell, Windows-Version, Arbeitsplatz, Zeitpunkt und letzte Änderung notieren.
- [ ] **Exaktes Gerät:** Maus, Tastatur, Headset, Speicher, Drucker o. a.; Hersteller/Modell, USB-A/USB-C, direkt über Kabel, USB-Receiver, Bluetooth oder Dock/Hub/KVM?
- [ ] **Symptom:** gar keine Reaktion, „USB-Gerät nicht erkannt“, sporadische Aussetzer, nur in einer Anwendung, nur nach Standby, falsche Eingabe?
- [ ] **Umfang:** nur ein Gerät, ein Port, alle USB-Ports, nur ein Dock oder ganze Geräteklasse?
- [ ] Haben Mitarbeitende noch **mindestens eine funktionsfähige Eingabemöglichkeit**? Bei Maus und Tastatur gleichzeitig ausgefallen: Ersatzgerät/Fernsupport nach Vorgabe organisieren.
- [ ] Gibt es **Speicher- oder Sicherheitsrisiken**? Laufende Kopiervorgänge, Wechselmedien, Produktionsgeräte, USB-Device-Control, sensibler Arbeitsplatz?
- [ ] Sichtbare Schäden/Hitze/Überstrom? Wenn ja: **Stop, sicherer Hardwareprozess**.

**Primärziel:** Betroffene Fehlerdomäne eingrenzen, nicht ungeprüft „USB-Treiberfehler“ in das Ticket schreiben.

## 2. Vorbedingungen – ohne riskante Änderung (L1)

- [ ] Nutzer über mögliche kurze Unterbrechung informieren; offene Arbeit sichern.
- [ ] Bei Kabelgerät: Steckersitz, Kabel, Buchse und Gerät sichtprüfen, **keine** beschädigten Anschlüsse weiternutzen.
- [ ] Bei Funkgerät: Batterie/Akku, Ein-/Aus-Schalter, Empfänger vorhanden und geeignet, Reichweite.
- [ ] Bei Bluetooth: Gerät im korrekten Modus? Bluetooth unter **Einstellungen → Bluetooth & Geräte** aktiviert?
- [ ] Bei Hub/Dock: Netzteil/Hostkabel prüfen; nach Möglichkeit **direkt am Notebook/PC** testen.
- [ ] Bei USB-Speicher: **Schreibvorgänge stoppen**, ggf. sicher auswerfen; kein vorschnelles Abziehen, Initialisieren oder Formatieren.
- [ ] **Keine** unfreigegebenen Fremdgeräte oder unbekannten USB-Sticks als Vergleich verwenden.

## 3. Kontrollierter A/B-Test (L1)

| Prüfung | Test A | Test B – genau eine Änderung | Befund aufnehmen |
|---|---|---|---|
| **Porttest** | Gerät A an ursprünglichem Port | Gerät A an anderem **direkten, geeigneten Port** | Ergebnis je Port |
| **Gerätetest** | Gerät A am ursprünglichen Port | Freigegebenes, intaktes Gerät B **am selben Port** | Gerät oder Port wahrscheinlicher? |
| **Hosttest** | Gerät A an PC 1 | Gerät A an zugelassenem PC 2 | Gerätespezifisch oder Host/Policy? |
| **Hubtest** | Gerät A über Hub/Dock | Gerät A direkt am PC | Hub/Dock-/Hostpfad betroffen? |
| **Funkvergleich** | Empfänger an bisheriger Position | Position/Abstand zu Störquellen ändern | Störung reproduzierbar besser? |

**Pflicht im Ticket:** A-Test, B-Test, *einziger* geänderter Faktor, Beobachtung, Wiederholbarkeit, neue Hypothese. Unterschiede zwischen PCs (Richtlinien, Treiber, Betriebssystem) können das Ergebnis beeinflussen.

## 4. Fehlerzweig A – Kabelgebundene Maus, Tastatur oder USB-Gerät (L1)

1. Strom-/Schaden-/Kabelprüfung gemäß Abschnitt 2.
2. Bei **unkritischem Eingabegerät** ab- und nach kurzer Pause wieder anstecken (mit Nutzerfreigabe). Bei Datenträgern nur nach Abschnitt 2!
3. Einen anderen **direkten** USB-Anschluss testen; Hub/KVM/Dock vorerst umgehen.
4. Mit bekannt funktionierender Maus/Tastatur im ursprünglichen Anschluss gegenprüfen.
5. Gerät an freigegebenem anderen PC testen, falls nötig.
6. Funktion **tatsächlich** bestätigen: Maus bewegen/klicken/scrollen; Tastatur in Testfeld schreiben.
7. Bleibt ein Port reproduzierbar defekt oder treten mehrere Geräte gleichzeitig aus: L2/Hardware mit A/B-Ergebnissen.

**Befundregel:** LED an ≠ USB-Datenstrecke ok; sichtbares PnP-Gerät ≠ nutzbare Eingabe.

## 5. Fehlerzweig B – USB-Funkempfänger (2,4 GHz), Maus oder Tastatur (L1)

- [ ] Verbindungstyp sicher festgestellt? **USB-Receiver ist nicht dasselbe wie Bluetooth.**
- [ ] Batterien/Akku, An-/Aus-Schalter, Modus des Geräts geprüft.
- [ ] USB-Receiver als richtiges, ggf. gekoppeltes Gegenstück vorhanden?
- [ ] Receiver direkt am PC statt an Hub/KVM/Dock getestet.
- [ ] Abstand, Metallflächen und mögliche Funkstörer überprüft; ggf. Empfänger mit **freigegebener** Verlängerung günstiger positioniert.
- [ ] Gerät und Receiver am freigegebenen Vergleichs-PC getestet (wenn unterstützt).
- [ ] Hersteller-Pairing nur nach Vorgaben, mit zugelassener Software, **nicht** blind; fehlende Kompatibilität beachten.
- [ ] Stabile Funktion mit wiederholten Bewegungen/Tastatureingaben bestätigt.

**Erklärung:** Ein vom PC erkannter USB-Empfänger beweist noch nicht die Funkkopplung zum Eingabegerät.

## 6. Fehlerzweig C – Bluetooth-Maus oder Bluetooth-Tastatur (L1)

- [ ] Akku/Schalter/Reichweite/Gerätemodus prüfen.
- [ ] Windows 11: **Einstellungen → Bluetooth & Geräte**: Bluetooth an? Gerät sichtbar/verbunden?
- [ ] Ist nur dieses Gerät oder der gesamte Bluetooth-Adapter betroffen?
- [ ] Geeignete Windows-Bluetooth-Problembehandlung über **Hilfe abrufen** nutzen; Ergebnis notieren.
- [ ] Falls möglich, anderes zugelassenes Bluetooth-Gerät vergleichen.
- [ ] Bei Pairingfehler **nach Freigabe** Verbindung gezielt entfernen und neu koppeln; vorher Eingabefallback sicherstellen.
- [ ] Bei Adapter-/Treiberfehler, fehlendem Bluetooth-Menü oder Sicherheitssperre an L2/Endpoint.

**Kein Fehlschluss:** „Gekoppelt“ ist nicht automatisch „verbunden und funktionsfähig“.

## 7. Windows-Geräte-Manager und lesende PowerShell (L1/L2)

**Geräte-Manager:** `Win + X` → Geräte-Manager / `devmgmt.msc` (falls sichere Eingabe möglich). Unter **USB-Controller**, **Eingabegeräte (HID)**, **Mäuse**, **Tastaturen**, **Bluetooth**, ggf. **Andere Geräte** prüfen. Gerätestatus/Fehlercode auslesen, **nichts auf Verdacht deaktivieren**.

```powershell
# 1. Präsente USB-/HID-/Maus-/Tastatur-/Bluetooth-Geräte (nur lesen)
Get-PnpDevice -PresentOnly |
  Where-Object { $_.Class -in @('USB','HIDClass','Mouse','Keyboard','Bluetooth') } |
  Select-Object Class, Status, FriendlyName, InstanceId |
  Sort-Object Class, FriendlyName

# 2. Aktuell präsente PnP-Instanzen mit Fehler-/Warnstatus (nur lesen)
Get-PnpDevice -PresentOnly |
  Where-Object { $_.Status -ne 'OK' } |
  Select-Object Class, Status, FriendlyName, InstanceId

# 3. Bei Bedarf Windows-PnP-Inventar und ConfigManagerErrorCode (nur lesen)
Get-CimInstance Win32_PnPEntity |
  Where-Object { $_.PNPClass -in @('USB','HIDClass','Mouse','Keyboard') } |
  Select-Object Name, PNPClass, Status, ConfigManagerErrorCode
```

**Code 10:** Startproblem; **22:** Gerät deaktiviert; **43:** Gerät/Treiber meldet Problem – **keiner** dieser Codes beweist allein defekte Hardware. Ein `Status OK` belegt weder funktionsfähige Funkstrecke noch nutzbare Eingabe. Fehlender Eintrag ist ebenfalls kein eindeutiger Defektbeweis. Nur notwendige Kennungen ins Ticket übernehmen.

## 8. Maßnahme nach Befund und Rückfallstrategie (L1/L2)

| Befund | Maßnahme | Freigabe / Risikogrenze |
|---|---|---|
| Defektes Eingabegerät/Kabel durch Gegenproben gestützt | Freigegebenes Ersatzgerät/-kabel | L1 / Hardwareausgabe |
| Fehler nur über Hub/Dock | Direkte Verbindung als Überbrückung; RB-023 zur Dockdiagnose | Keine unkontrollierten Dock-Resets |
| Akku leer, Empfänger ungünstig, Funkstörung plausibel | Batterie, Schalter, Empfängerposition korrigieren | L1, mit Re-Test |
| Bluetooth nicht gekoppelt | Zielgerichtet koppeln (nach Zustimmung) | Fallback-Eingabe vorher sicherstellen |
| Deaktiviertes oder verwaltetes Gerät | Ursache/Richtlinie prüfen, Freigabe einholen | Endpoint/Security, niemals umgehen |
| Controller-/Treiberfehler, nach Standby reproduzierbar | L2 bewertet OEM-Treiber, Energieverwaltung, Rollback | **Nicht** pauschal USB-Controller deinstallieren |
| Überstrom/Hitze/Portdefekt | Test stoppen, Arbeitsplatz sichern, Hardwareprozess | Kein L1-Reparaturversuch |
| Speicher mit Fehlern/Datenrisiko | Keine Initialisierung/Formatierung; Datensicherung/Recovery-Prozess | Daten priorisieren |

**USB Selective Suspend:** Microsoft empfiehlt, die Energieeinsparung nicht pauschal zu deaktivieren. Ein Auftreten nach Standby ist zunächst **Korrelation**, keine Ursachenbestätigung. Änderungen an Treibern, Firmware, BIOS/UEFI, Registry, USB-Sperr- oder Energieeinstellungen nur kontrolliert durch zuständige Stelle.

## 9. Funktionskontrolle, Dokumentation und L2-Übergabe

**Erfolg ist eine funktionierende Tätigkeit, nicht nur der Gerätestatus:**

- [ ] Maus: Zeiger, Linksklick/Rechtsklick, ggf. Scrollen zuverlässig.
- [ ] Tastatur: Texteingabe und betroffene Tasten; Layout/Fn/NumLock ggf. berücksichtigt.
- [ ] Funkgerät: stabil über eine für das Fehlersymptom angemessene Testdauer; ggf. nach Reconnect/Standby nachtesten.
- [ ] Anderes USB-Gerät: tatsächlich benötigte Funktion erfolgreich (nur in freigegebener Testumgebung).
- [ ] Nutzende Person bestätigt die Wiederherstellung; eventuelle Einschränkung/Workaround benannt.
- [ ] **Dokumentiert:** Vorher → A/B-Test → Ursache/Hypothese → einzelne Maßnahme → Re-Test → Benutzerbestätigung.

**Übergabe an L2 bei:** multiplen ausgefallenen direkten Ports, USB-Controller-/PnP-Fehlern, Richtlinie/Endpoint-Sperre, fehlendem sicheren Eingabepfad, Treiber-/Firmwarethema, mechanischem Schaden, Datenträgerrisiko oder unklarem reproduzierbarem Fehler.

### Kopierbarer Ticketkommentar (Beispiel – fiktiv)

```text
Störung: USB-Tastatur an Dock zeitweise ohne Eingabe; direkt am PC intakt.
Eingrenzung: Strom/Stecker ohne sichtbare Schäden. A: Dock-USB-Port =
Aussetzer; B: gleiche Tastatur direkt am Notebook = stabil.
Zusatztest: bekannte intakte Tastatur über Dock ebenfalls betroffen.
Bewertung: Dock-/Hubpfad wahrscheinlicher, exakte Ursache offen.
Maßnahme: Freigegebene Direktverbindung als Übergang, RB-023 an L2.
Re-Test: Direkte Tastatureingabe mit Anwender geprüft, erfolgreich.
Status: Eingabe wieder nutzbar, Dockproblem gesondert offen.
```

## 10. Quellen, Transparenz und Lernkontrolle

**Herstellerquellen – Recherche 22.11.2026:**

1. Microsoft – Probleme mit Maus und Tastatur unter Windows: https://support.microsoft.com/de-de/windows/hardware/input-devices/mouse-and-keyboard-problems-in-windows
2. Dell – How to Fix USB Port Issues on Your Dell Computer: https://www.dell.com/support/kbdoc/en-us/000132048/how-to-troubleshoot-usb-issues
3. Microsoft – Bluetooth-Probleme in Windows beheben: https://support.microsoft.com/de-de/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows
4. Logitech – Wireless device does not work or is not recognized: https://support.logi.com/hc/en-150/articles/360023204454-Wireless-device-does-not-work-or-is-not-recognized
5. Microsoft Learn – USB Selective Suspend: https://learn.microsoft.com/de-de/windows-hardware/drivers/usbcon/usb-selective-suspend
6. Microsoft – Fehlercodes im Geräte-Manager: https://support.microsoft.com/de-de/windows/hardware/drivers/error-codes-in-device-manager-in-windows

**Transparenz:** Dieses Runbook ist eine recherchierte, noch **nicht im Labor validierte** Arbeitsanweisung; Beispiel-Tickets sind fiktiv. Die Befehle im Runbook sind ausschließlich lesend. Die abgeleitete Diagnose-Reihenfolge ist eine eigene Zusammenstellung und kein offizielles Komplettverfahren eines einzelnen Herstellers.

**Kurztest ohne Runbook:** Eine USB-Maus fällt nur am Hub aus. Formuliere zwei Ursachenhypothesen, einen Vergleichstest mit **nur einer Änderung** sowie den Nachweis, der eine Eskalation an L2 fachlich rechtfertigt. Nach 7 und 21 Tagen mit einem abgewandelten Szenario wiederholen.
