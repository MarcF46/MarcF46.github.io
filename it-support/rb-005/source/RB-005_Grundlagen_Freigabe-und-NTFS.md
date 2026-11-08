# RB-005 – Grundlagen: Netzwerkfreigabe, NTFS und zusätzliche Zugriffskontrollen

> **Ergänzung zu RB-005 – Zugriff auf Datei oder Ordner verweigert**  
> **Stand:** 08.11.2026 · **Version:** 1.1 · **Zielgruppe:** Einsteiger im 1st-/2nd-Level-Support  
> **Status:** Anhand von Microsoft Learn recherchiertes Lernmaterial; die genannten Beispiele sind fiktiv und nicht praktisch validiert.

![Das Zwei-Schranken-Prinzip – Freigabe und NTFS im Henne-Ei-Stil](assets/rb005_zwei_schranken_henne_ei.png)

*Bildunterschrift: Freigabe- und NTFS-Berechtigungen bilden zwei Kontrollen für den SMB-Netzwerkzugriff. Die Darstellung vereinfacht die tatsächliche Rechteprüfung. Die Netzlaufwerkszuordnung über GPO erteilt keine Dateiberechtigung. Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.*

## 1. Das Grundprinzip – was unterscheidet eine Freigabe von NTFS?

Stell dir einen Dateiserver `FS01` vor. Dort befindet sich lokal der Ordner `D:\Freigaben\Projekte`. Er ist über das Netzwerk als `\\FS01\Projekte` erreichbar.

- **Netzwerkfreigabe**: Der Server bietet einen Ordner im Netzwerk unter einem Freigabenamen an. Über die **Freigabeberechtigungen** wird geregelt, was ein Benutzer über *diesen Netzwerkzugang* grundsätzlich tun darf.
- **NTFS-Berechtigungen (New Technology File System)**: Sie regeln den Zugriff auf Dateien und Ordner **im Dateisystem**. Sie gelten auch bei lokalem Zugriff auf den Server und bestimmen unter anderem Lesen, Schreiben, Ändern und Löschen.
- **SMB (Server Message Block)**: Das Windows-Netzwerkprotokoll, mit dem ein Client auf eine Dateifreigabe zugreift.

Ein Benutzer, der über SMB auf eine Datei zugreift, benötigt die passenden Rechte **auf beiden Ebenen**. Bei Zugriff *lokal auf den Serverpfad* greifen die Freigabeberechtigungen für diesen Zugriffsweg nicht; die NTFS-Rechte bleiben relevant.

| Freigabe erlaubt | NTFS erlaubt | Vereinfachtes Ergebnis bei SMB-Zugriff |
|---|---|---|
| Lesen | Lesen | Datei lesen |
| Lesen | Ändern | Nur lesen |
| Ändern | Lesen | Nur lesen |
| Ändern | Ändern | Lesen und ändern |
| Vollzugriff | Keine passende Erlaubnis auf NTFS | Zugriff wird verweigert |

**Merksatz:** *Beim Netzwerkzugriff gilt die restriktivere (**strengere oder stärker einschränkende**) Berechtigung.* Die Freigabe kann also nicht mehr Rechte bereitstellen, als NTFS für die gewünschte Operation zulässt – und umgekehrt.

**Achtung:** Die Tabelle ist ein **vereinfachtes Denkmodell**. Explizite Verweigerungen, geerbte Regeln und weitere Sicherheitsmechanismen können das Ergebnis zusätzlich beeinflussen. „Vollzugriff“ ist keine notwendige oder angemessene Standardberechtigung für normale Mitarbeiter.

**Quelle:** [Microsoft Learn – Zusammenspiel von Freigabe- und NTFS-Berechtigungen](https://learn.microsoft.com/de-de/iis/web-hosting/configuring-servers-in-the-windows-web-platform/configuring-share-and-ntfs-permissions).

## 2. Zusätzliche Verweigerungsregeln: Was bedeutet „Deny“?

Windows-Dateiberechtigungen werden in einer **ACL (Access Control List = Zugriffskontrollliste)** gespeichert. Jede einzelne Regel darin heißt **ACE (Access Control Entry = Berechtigungseintrag)**. Für die Zugriffsentscheidung wird besonders die **DACL (Discretionary Access Control List = Liste erlaubender und verweigernder Zugriffsregeln)** berücksichtigt.

Es gibt zwei grundsätzliche Regelarten:

- **Allow (Zulassen):** Die Regel erlaubt einer Person oder Gruppe eine oder mehrere Operationen, etwa `Lesen`.
- **Deny (Verweigern):** Die Regel verbietet einer Person oder Gruppe bestimmte Operationen ausdrücklich, etwa `Schreiben`.

**Praxisbeispiel:** Die AD-Gruppe `GG_Buchhaltung` darf die Datei `Planung.xlsx` lesen. Mitarbeiter `FIRMA\max` ist Mitglied dieser Gruppe, hat aber zusätzlich einen **expliziten Deny-Eintrag für Lesen** auf genau dieser Datei. Trotz Gruppenmitgliedschaft kann Max die Datei dann in einer üblichen, korrekt geordneten Windows-ACL nicht lesen.

### „Nicht erlaubt“ und „ausdrücklich verboten“ sind verschieden

| Situation | Bedeutung |
|---|---|
| Keine passende erlaubende Regel | Windows gewährt das benötigte Recht nicht. Es ist keine eigene Deny-Regel nötig. |
| Eine Regel verweigert Lesen ausdrücklich | Ein passender Deny-Eintrag kann die Leseoperation auch dann blockieren, wenn andere Gruppen sie erlauben. |
| Eine Regel verweigert nur Löschen | Lesen kann weiterhin möglich sein, sofern die erforderlichen Leserechte erlaubt sind. |

**Technische Präzisierung:** Bei einer **kanonisch geordneten** Windows-DACL werden explizite Verweigerungen vor expliziten Erlaubnissen verarbeitet; danach folgen geerbte Einträge. Die konkrete Entscheidung hängt von den angeforderten Rechten, dem Zugriffstoken und der tatsächlichen Reihenfolge der passenden Regeln ab. Deshalb ist „Deny schlägt immer alles“ als pauschale Aussage zu grob.

**Warum nicht bei Problemen einfach einen Deny-Eintrag löschen?** Er könnte bewusst zum Schutz sensibler Daten gesetzt worden sein. Änderungen erfordern eine fachliche Freigabe und gehören bei unklaren Zusammenhängen in den Second-Level-Support.

**Quellen:** [Microsoft Learn – DACLs und ACEs](https://learn.microsoft.com/en-us/windows/win32/secauthz/dacls-and-aces), [Reihenfolge der Regeln](https://learn.microsoft.com/en-us/windows/win32/secauthz/order-of-aces-in-a-dacl), [icacls](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/icacls).

## 3. Vererbung: Warum darf ich den Hauptordner, aber nicht den Unterordner öffnen?

**Vererbung** bedeutet: Ein Ordner kann dafür vorgesehene Berechtigungen von seinem übergeordneten Ordner an Unterordner und Dateien weitergeben.

```text
D:\Freigaben\Projekte                 (Hauptordner)
  ├── Einkauf                         (Unterordner)
  │    └── Bestellungen.xlsx          (Datei)
  └── Buchhaltung                     (Unterordner)
       └── Gehaltsplanung.xlsx        (Datei)
```

**Beispiel:** `Projekte` erlaubt der Gruppe `GG_Projekte` das Lesen, und die Regel wird an `Einkauf` vererbt. Dort kann der Zugriff daher ebenfalls erlaubt sein. Für `Buchhaltung` kann die Vererbung allerdings gezielt unterbrochen oder durch eigene Regeln ergänzt werden – beispielsweise damit nur zuständige Personen Gehaltsdaten lesen dürfen.

Bei der Prüfung ist zu unterscheiden:

- **Geerbte Berechtigung:** Kommt aus einem übergeordneten Ordner.
- **Explizite Berechtigung:** Wurde direkt auf dem untersuchten Ordner oder der Datei gesetzt.
- **Vererbung deaktiviert:** Neue Berechtigungen des übergeordneten Ordners werden für diese DACL nicht mehr automatisch in der gewöhnlichen Form übernommen.

**Wichtig:** Nicht jede Berechtigung für einen Ordner muss auch für alle Unterordner und Dateien gelten: Dafür existieren unterschiedliche Vererbungs- und Geltungsoptionen. Änderungen an der Vererbung können ganze Ordnerbäume beeinflussen; niemals ohne Freigabe rekursiv zurücksetzen.

**Lesende Diagnose am Dateiserver:**

```powershell
# Der Pfad befindet sich lokal auf dem Dateiserver FS01.
$pfad = 'D:\Freigaben\Projekte\Buchhaltung'

# Liest die NTFS-Sicherheitsinformationen des untersuchten Ordners.
$acl = Get-Acl -LiteralPath $pfad

# Prüft, ob die Vererbung für die DACL geschützt/deaktiviert wurde.
$acl | Select-Object Owner, AreAccessRulesProtected

# Zeigt jede Regel, ihre Art und ihre Herkunft an.
# IsInherited = True bedeutet: diese Regel wurde geerbt.
$acl.Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited
```

`AreAccessRulesProtected = True` weist darauf hin, dass die DACL vor Vererbung geschützt ist; `False` bedeutet, dass Vererbung nicht in dieser Weise abgeschaltet ist. Ein einzelnes angezeigtes Recht beweist noch nicht den effektiven Zugriff des Benutzers.

**Quellen:** [Microsoft Learn – ACE-Inheritance Rules](https://learn.microsoft.com/en-us/windows/win32/secauthz/ace-inheritance-rules), [Get-Acl](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl), [icacls](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/icacls).

## 4. Weitere Sicherheitsmechanismen – wenn Freigabe und NTFS scheinbar stimmen

Nicht jede Zugriffsverweigerung entsteht ausschließlich durch die beiden Berechtigungstabellen.

| Mechanismus | Einfach erklärt | Typisches Symptom / erster Prüfansatz |
|---|---|---|
| **AD-Gruppen und Zugriffstoken** | Windows prüft die Gruppenkennungen, die in der aktuellen Anmeldung enthalten sind. | Neu zugewiesene Gruppe steht schon in AD, aber noch nicht im Benutzer-Token; nach freigegebenem Ab-/Anmelden erneut prüfen. |
| **ABE (Access-Based Enumeration = berechtigungsabhängige Auflistung)** | Ein Dateiserver kann Ordner und Dateien **aus der Anzeige ausblenden**, wenn dem Benutzer passende Rechte fehlen. | Unterordner erscheint gar nicht in der Liste. ABE gibt keine zusätzlichen Berechtigungen. |
| **EFS (Encrypting File System = verschlüsselndes Dateisystem)** | Einzelne Dateien können kryptografisch an berechtigte Benutzer/Zertifikate gebunden sein. | NTFS-Lesen scheint erlaubt, Datei lässt sich dennoch nicht entschlüsseln/öffnen. |
| **Zentrale Zugriffsrichtlinien (Dynamic Access Control)** | Windows Server kann zusätzliche Regeln anhand von Benutzer-, Geräte- und Dateieigenschaften anwenden. | Richtlinie für vertrauliche Dokumente verweigert den Zugriff trotz vermeintlich passender ACL. |
| **SMB-Sicherheitsrichtlinien** | Client und Server müssen sichere Protokoll- und Anmeldeverfahren unterstützen. | Freigabe ist trotz richtiger NTFS-Rechte nicht erreichbar; z. B. wird unsicherer Gastzugriff blockiert. |
| **Defender „Überwachter Ordnerzugriff“** | Kann nicht vertrauenswürdige Programme am **Ändern** geschützter Dateien hindern. | Ein Programm kann in einem geschützten Ordner nicht speichern, andere Programme eventuell schon. |
| **Dateisperre oder Schreibschutz** | Datei ist durch ein anderes Programm belegt oder als schreibgeschützt gekennzeichnet. | Öffnen zum Lesen geht, Speichern oder Überschreiben nicht. Das ist nicht automatisch ein NTFS-ACL-Fehler. |

### ABE ist nicht gleich Zugriffsberechtigung

Wenn auf einem Server **Access-Based Enumeration (ABE)** aktiviert ist, sieht ein Benutzer womöglich nur die Unterordner, für die er passende Berechtigungen besitzt. Das ist in der Oberfläche übersichtlicher, ersetzt aber **keine** NTFS- oder Share-Berechtigungen. Ist ABE ausgeschaltet, kann ein Ordner sichtbar sein, obwohl man ihn nicht öffnen darf.

**Lesende Prüfung am Fileserver:**

```powershell
# Liest Freigabename und Einstellung für die Ordnerauflistung aus.
# FolderEnumerationMode zeigt zum Beispiel AccessBased oder Unrestricted.
Get-SmbShare -Name 'Projekte' |
    Select-Object Name, Path, FolderEnumerationMode
```

**Quellen:** [Microsoft Learn – ABE prüfen](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/high-cpu-usage-issue-smb-server), [EFS trotz NTFS-Zugriff](https://learn.microsoft.com/de-de/troubleshoot/windows-client/backup-and-storage/access-denied-error-appears-permissions-are-correct), [Dynamic Access Control](https://learn.microsoft.com/en-us/windows-server/identity/solution-guides/dynamic-access-control-overview), [SMB Zugriff verweigert](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/access-denied-access-smb-file-share), [Defender: Überwachter Ordnerzugriff](https://learn.microsoft.com/de-de/defender-endpoint/controlled-folder-access-overview).

## 5. Wo spielt die Gruppenrichtlinie (GPO) hinein?

**GPO** steht für **Group Policy Object**, auf Deutsch **Gruppenrichtlinienobjekt**. Eine GPO kann beispielsweise dafür sorgen, dass der Windows-Explorer ein Netzlaufwerk automatisch verbindet.

**Beispiel aus einem Übungslab:**

1. Auf dem Server wurde `D:\Freigaben\Projekte` als `\\FS01\Projekte` freigegeben.
2. Eine Berechtigungsgruppe wurde für die benötigten Freigabe- und NTFS-Rechte vorgesehen.
3. Eine GPO richtet für die passenden Benutzer eine **Laufwerkszuordnung** ein: `P:` → `\\FS01\Projekte`.
4. Nach der Anwendung kann im Explorer das Laufwerk `P:` erscheinen. **Das Laufwerkssymbol ist aber noch kein Nachweis, dass der Benutzer jede Datei öffnen darf.** Der Zugriff wird weiter anhand der tatsächlichen Rechte geprüft.

**GUI-Pfad im Gruppenrichtlinienverwaltungs-Editor:** **Benutzerkonfiguration → Einstellungen → Windows-Einstellungen → Laufwerkszuordnungen** (*User Configuration → Preferences → Windows Settings → Drive Maps*).

**Begriffe unterscheiden:**

| Funktion | Erzeugt was? | Vergibt automatisch Dateirechte? |
|---|---|---|
| Windows-Ordnerfreigabe | SMB-Freigabe mit Netzwerkpfad | Nein – die Rechte müssen passend konfiguriert werden. |
| GPO-Laufwerkszuordnung | Netzlaufwerksbuchstaben wie `P:` beim Benutzer | **Nein.** |
| AD-Sicherheitsgruppe | Gruppe zur Zuordnung von Benutzern/Rechten | Noch nicht – sie muss in passenden Berechtigungsregeln verwendet werden. |
| NTFS- und Freigabeberechtigungen | Konkrete Zugriffsregeln am Server | **Ja**, im Rahmen der jeweils gesetzten Regeln. |

Die GPO kann zwar auch andere Einstellungen verwalten, etwa in gesonderten Konfigurationen Netzwerkfreigaben. **Die Laufwerkszuordnung selbst** ist jedoch kein Freigabe- oder NTFS-Berechtigungseintrag.

**Fehlerdiagnose:** Ist `P:` nicht sichtbar, teste gegebenenfalls den UNC-Pfad `\\FS01\Projekte` direkt. Wenn dieser funktioniert, liegt das Problem möglicherweise allein an der Laufwerkszuordnung. Wenn der Pfad erreichbar ist, aber der Unterordner „Zugriff verweigert“ meldet, sind andere Prüfungen notwendig.

**Lesende Befehle auf dem Client im Benutzerkontext:**

```powershell
# Zeigt dem Benutzer aktuell zugeordnete SMB-Laufwerke an.
Get-SmbMapping | Select-Object LocalPath, RemotePath, Status

# Zeigt einen Überblick über angewendete Gruppenrichtlinien an.
# gpresult ist ein Windows-Kommandozeilenprogramm.
gpresult /r
```

**Quellen:** [Microsoft Learn – Group Policy Preferences und Drive Maps](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-preferences), [Microsoft Learn – Fehlersuche bei GPO-Netzlaufwerken](https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/scenario-guide-gpo-to-map-network-drive-doesn-t-apply-as-expected).

## 6. Welcher Fehler gehört zu welchem Diagnosezweig?

| Beobachtung | Zuerst prüfen |
|---|---|
| Das Netzlaufwerk `P:` fehlt im Explorer. | GPO-Laufwerkszuordnung, Benutzerkontext, Netzwerkverbindung; UNC-Pfad direkt testen. |
| `\\FS01\Projekte` kann nicht erreicht werden. | DNS, SMB-Port 445, VPN, Routing, Firewall und SMB-Sicherheitsrichtlinien. |
| Freigabe ist erreichbar, aber Unterordner meldet „Zugriff verweigert“. | Freigaberechte, NTFS-Rechte, Deny, Vererbung, Gruppen und Token. |
| Nur ein bestimmter Unterordner fehlt in der Ansicht. | NTFS-Gültigkeitsbereich, ABE und mögliche Vererbung prüfen. |
| Datei kann gelesen, aber nicht gespeichert werden. | Gewünschtes Schreibrecht, Dateisperre, Schreibschutz und ggf. Sicherheitsfunktionen. |
| ACL erlaubt Lesen, Datei lässt sich dennoch nicht öffnen. | Identitätskontext, Verschlüsselung (EFS) und weitere Richtlinien untersuchen. |

## 7. Was kommt in den Ticketkommentar?

**Fiktives Beispiel:** „Netzlaufwerk P: auf PC-023 fehlt. Direkter UNC-Zugriff auf `\\FS01\Projekte` mit dem betroffenen Konto erfolgreich. Freigabe- und NTFS-Rechte des für den Benutzer bestimmten Ordners unverändert und ausreichend. Gruppenrichtlinienzuordnung überprüft; Laufwerkszuordnung gemäß Unternehmensvorgaben wiederhergestellt. Zugriff auf freigegebene Dateien durch Benutzer bestätigt. Keine Berechtigungserweiterung vorgenommen.“

Wenn stattdessen eine NTFS-Verweigerung vorliegt, müssen **die konkrete Regel, der betroffene Pfad, die benötigte Operation und die genehmigte Maßnahme** dokumentiert werden. Ein oberflächliches „Freigabe repariert“ würde nicht reichen.

## 8. Quellenstand und Lernfragen

Alle oben aufgeführten verlinkten Microsoft-Learn-Seiten dienen der technischen Einordnung. **Recherchierte Inhalte sind keine eigene Praxisvalidierung.** Die Abbildungen zeigen ein Modell, keine automatisch ausgelesene Produktionsumgebung.

**Drei Selbsttests:**

1. Ein Benutzer sieht `P:`, kann aber keine Datei öffnen. Beweist das, dass die GPO falsch ist? Warum (nicht)?
2. Eine Freigabe erlaubt „Ändern“, NTFS aber nur „Lesen“. Darf ein Benutzer eine bestehende Datei verändern?
3. Warum kann ein ausdrücklich verweigertes Recht eine anderweitige Gruppenfreigabe ausschließen?
