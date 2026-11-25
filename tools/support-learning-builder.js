(function buildSupportTicket(n,original,spec){
  const htmlEscape=v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const answer=(body,memo)=>`<details><summary>Musterantwort anzeigen</summary><div class="support-learning-answer"><p>${body}</p><p class="support-learning-memo"><strong>Merksatz:</strong> ${memo}</p></div></details>`;
  const module=(id,number)=>`<h2 id="${id}">${number?number+". ":""}Praxisbeispiele und Wissenscheck</h2>
<p>Erst selbst überlegen, dann die Antwort aufklappen. Diese kurzen Übungsfälle sind <strong>fiktiv und noch nicht praktisch validiert</strong>.</p>
<div class="support-learning">
${spec.cases.map((t,i)=>`<section class="support-learning-case"><h3>Beispiel ${i+1}</h3><p><strong>Eingangsticket:</strong> ${t[0]}</p><p><strong>Frage:</strong> ${t[1]}</p>${answer(t[2],t[3])}</section>`).join("\n")}
<h3>Wissenscheck</h3>
<p>Beantworte die Fragen möglichst ohne Nachschlagen und kontrolliere anschließend deine Antwort.</p>
<ol class="support-learning-quiz">
${[...spec.quiz,["Wie kontrollierst du nach der Maßnahme den Erfolg?",spec.check]].map(([q,a],i)=>`<li><p><strong>${q}</strong></p>${answer(a,i===2?"Ein dokumentierter Funktionstest ist wichtiger als eine bloße Erfolgsmeldung.":spec.cases[i][3])}</li>`).join("\n")}
</ol></div>`;
  const commands={
    "Get-PnpDevice":"Liest Plug-and-Play-Geräte und deren Status.",
    "Get-ADUser":"Liest Eigenschaften von Active-Directory-Benutzern.",
    "Get-ADGroup":"Liest eine Active-Directory-Gruppe.",
    "Get-ADGroupMember":"Liest die Mitglieder einer Active-Directory-Gruppe.",
    "Get-WinEvent":"Liest Windows-Ereignisprotokolle.",
    "Get-Service":"Liest Status und Startkonfiguration von Diensten.",
    "Get-Process":"Liest laufende Prozesse, nicht deren vollständige Funktionsfähigkeit.",
    "Get-NetAdapter":"Liest Netzwerkadapter und Verbindungsstatus.",
    "Get-NetIPConfiguration":"Liest IP-, DNS- und Gatewayinformationen des Clients.",
    "Test-NetConnection":"Prüft Erreichbarkeit bzw. den angegebenen TCP-Zielport.",
    "Get-DnsClientServerAddress":"Liest die eingestellten DNS-Server.",
    "Resolve-DnsName":"Stellt DNS-Abfragen für Namen oder Recordtypen.",
    "Get-DnsClient":"Liest DNS-Client-Eigenschaften.",
    "Get-DnsClientGlobalSetting":"Liest globale DNS-Client-Einstellungen.",
    "Get-NetTCPConnection":"Liest vorhandene TCP-Verbindungen und Listener.",
    "Get-NetRoute":"Liest die Routingtabelle von Windows.",
    "Get-CimInstance":"Liest Systeminformationen über CIM-Klassen.",
    "Get-Volume":"Liest Informationen zu Datenträgervolumes.",
    "Get-Disk":"Liest Datenträgerinformationen.",
    "Get-ChildItem":"Listet Elemente eines Dateisystempfads oder eines anderen Providers.",
    "Get-Item":"Liest ein einzelnes Element anhand seines Pfads.",
    "Get-ItemProperty":"Liest Eigenschaften, etwa aus der Windows-Registry.",
    "Get-Content":"Liest den Inhalt einer Datei.",
    "Get-MessageTraceV2":"Liest die Exchange-Online-Nachrichtenverfolgung.",
    "Get-EXOMailbox":"Liest Exchange-Online-Postfachinformationen.",
    "Get-EXOMailboxStatistics":"Liest Statistiken eines Exchange-Online-Postfachs.",
    "Get-MgUser":"Liest einen Benutzer aus Microsoft Entra über Microsoft Graph.",
    "Get-MgContext":"Zeigt Informationen zur aktuellen Microsoft-Graph-Sitzung.",
    "Get-MgUserLicenseDetail":"Liest einem Benutzer zugeordnete Lizenzdetails.",
    "Connect-MgGraph":"Öffnet eine authentifizierte Microsoft-Graph-Sitzung.",
    "Connect-ExchangeOnline":"Öffnet eine authentifizierte Exchange-Online-PowerShell-Sitzung.",
    "Import-Module":"Lädt ein PowerShell-Modul in die Sitzung.",
    "Where-Object":"Filtert Pipeline-Objekte anhand einer Bedingung.",
    "Select-Object":"Wählt Objekte oder deren Eigenschaften für die Ausgabe aus.",
    "Sort-Object":"Sortiert Objekte nach einem oder mehreren Merkmalen.",
    "Format-Table":"Formatiert die Ausgabe als Tabelle.",
    "Format-List":"Formatiert ausgewählte Eigenschaften als Liste.",
    "Measure-Object":"Berechnet z. B. Anzahl, Summe oder Mittelwerte über Eingaben.",
    "Test-Path":"Prüft, ob ein Pfad vorhanden ist.",
    "Join-Path":"Setzt Pfadbestandteile passend zum Provider zusammen.",
    "Set-ADAccountPassword":"Kann ein AD-Kennwort verändern; nur nach Freigabe einsetzen.",
    "Get-BitLockerVolume":"Liest Statusinformationen zu BitLocker-Volumes.",
    "Get-Printer":"Liest die konfigurierten Drucker.",
    "Get-PrintJob":"Liest Druckaufträge aus einer Warteschlange.",
    "Get-VpnConnection":"Liest Windows-VPN-Verbindungsprofile.",
    "Get-NetFirewallRule":"Liest Regeln der Windows-Firewall.",
    "Get-NetFirewallPortFilter":"Liest die zu Firewallregeln gehörenden Portfilter."
  };
  const params={
    "-Identity":"Benanntes Zielobjekt (z. B. Benutzerkonto).",
    "-Properties":"Zusätzliche Objekteigenschaften anfordern.",
    "-Filter":"Ergebnis anhand einer Filterbedingung einschränken.",
    "-FilterHashtable":"Ereignisfilter in Form einer Hashtabelle übergeben.",
    "-ComputerName":"Zielcomputer der jeweiligen Abfrage.",
    "-Port":"Zu prüfender TCP-Port.",
    "-Name":"Name des abgefragten Elements (abhängig vom Cmdlet).",
    "-ErrorAction":"Reaktion auf nicht terminierende Fehler steuern.",
    "-First":"Die ersten Treffer der Ausgabemenge auswählen.",
    "-PresentOnly":"Auf aktuell vorhandene PnP-Geräte beschränken.",
    "-Class":"Nach der gewählten Geräte- oder CIM-Klasse filtern.",
    "-WhatIf":"Unterstützte Änderungen simulieren, ohne sie auszuführen.",
    "-UserId":"Kennung eines Benutzerobjekts in Microsoft Graph.",
    "-Scopes":"Berechtigungsbereiche für die Verbindung angeben.",
    "-Server":"Den angesprochenen Server festlegen (kontextabhängig).",
    "-Property":"Angeforderte Eigenschaft beziehungsweise Eigenschaften festlegen.",
    "-Path":"Einen Dateisystem- oder Providerpfad angeben.",
    "-LiteralPath":"Pfad wörtlich interpretieren, ohne Wildcards auszuwerten.",
    "-Recurse":"Untergeordnete Verzeichnisse bzw. Elemente einbeziehen.",
    "-Descending":"Absteigende Sortierreihenfolge.",
    "-SortBy":"Sortierkriterium."
  };
  const explain=(raw,lang)=>{
    const plain=raw.replace(/<[^>]*>/g,"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
    const program=plain.split("\n").filter(x=>!/^\s*(?:#|::|REM\s)/i.test(x)).join("\n");
    const cmd=[...new Set((program.match(/\b(?:Get|Set|Test|Connect|Import|Resolve|Start|Stop|New|Remove|Enable|Disable|Restart|Select|Sort|Where|Format|Measure|Out|Invoke|Export|Find|Update|Clear)-[A-Za-z][\w-]*/g)||[]))].slice(0,4);
    if(cmd.length===0 && lang!=="powershell")return "";
    let notes=[];
    for(const c of cmd){
      let desc=commands[c];
      if(!desc){
        const verb=c.split("-")[0];
        desc=verb==="Get"?"Fragt Daten zum angegebenen Objekt ab.":verb==="Set"||verb==="Remove"||verb==="New"?"Kann den Systemzustand verändern; vor Ausführung Berechtigungen und Auswirkungen prüfen.":"Verarbeitet Daten oder führt eine Aktion aus; Parameter und Ausführungsort bestimmen die genaue Wirkung.";
      }
      notes.push(`<li><code>${htmlEscape(c)}</code>: ${desc}</li>`);
    }
    if(program.includes("|"))notes.push("<li><code>|</code> reicht Pipeline-Objekte an den nächsten Befehl weiter.</li>");
    if(program.includes("$_"))notes.push("<li><code>$_</code> ist das aktuelle Pipeline-Objekt; etwa <code>$_.Status</code> greift auf dessen Eigenschaft <code>Status</code> zu.</li>");
    if(/\$[A-Za-z_]\w*/.test(program))notes.push("<li><code>$name</code> ist eine Variable; <code>=</code> weist ihr einen Wert zu.</li>");
    if(program.includes("@("))notes.push("<li><code>@(...)</code> definiert eine Sammlung (Array).</li>");
    if(program.includes("@{"))notes.push("<li><code>@{...}</code> erstellt eine Hashtabelle mit benannten Einträgen.</li>");
    if(/\s-in\s/.test(program))notes.push("<li><code>-in</code> prüft, ob der linke Wert in der rechts angegebenen Sammlung enthalten ist.</li>");
    if(/\s-ne\s/.test(program))notes.push("<li><code>-ne</code> bedeutet „ungleich“.</li>");
    if(/\s-eq\s/.test(program))notes.push("<li><code>-eq</code> bedeutet „gleich“.</li>");
    if(/\s-and(?:\s|$)/.test(program))notes.push("<li><code>-and</code> verbindet zwei Bedingungen mit logischem UND.</li>");
    for(const [p,desc] of Object.entries(params)){
      if(new RegExp(`(^|[^\\w])${p}(?=\\W|$)`,"m").test(program))notes.push(`<li><code>${p}</code>: ${desc}</li>`);
      if(notes.length>=7)break;
    }
    if(!notes.length)return "";
    return `<details class="support-code-explain"><summary>Befehl im Detail verstehen</summary><div class="support-learning-answer"><ul>${notes.slice(0,7).join("")}</ul><p>Die kopierbaren Befehle bleiben unverändert. Eine korrekte Ausgabe hängt von Systemzustand, Berechtigung und Ausführungsort ab.</p></div></details>`;
  };
  if(!spec||spec.cases?.length!==2||spec.quiz?.length!==2||!spec.check)throw Error("Unvollständige Lerninhalte "+n);
  let s=original,originalCode=(s.match(/class="code-block"/g)||[]).length;
  const headings=[...s.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(x=>({at:x.index,id:x[1],text:x[2],html:x[0]}));
  const picks=headings.filter(h=>/Lernkontrolle|Active Recall|Wissenskontrolle|Wissenstransfer|Selbsttest|Lerntests|Diagnosekompetenz|Aktives Abrufen|Wissensabruf/i.test(h.text));
  let target=picks[picks.length-1];
  if(target){
    const idx=headings.findIndex(h=>h.at===target.at);
    let end=idx+1<headings.length?headings[idx+1].at:s.indexOf('</div><div class="support-source-path"',target.at);
    if(end<0)end=s.indexOf('</div><nav class="support-bottom-nav"',target.at);
    if(end<=target.at)throw Error("Lernbereichsgrenze fehlt "+n);
    const old=s.slice(target.at,end);
    const source=[...old.matchAll(/<h3 id="[^"]+">([^<]+)<\/h3>/g)].find(h=>/Quellen|Hersteller|Referenzen|Validierung|Prüfstatus|Eigene Validierung/i.test(h[1]));
    const preservation=source?old.slice(source.index):"";
    const prior=old.slice(target.html.length,source?source.index:old.length);
    const number=target.text.match(/^\s*(\d+)\./)?.[1]||"";
    const keepExtra=/Muster|Ticketabschluss|Eskalation|Abschluss/i.test(target.text)||(prior.match(/class="code-block"/g)||[]).length>0;
    const extra=keepExtra&&prior.trim()?`<details class="support-code-explain"><summary>Ergänzende Fallanalyse und bisherige Übungen</summary><div class="support-learning-answer">${prior}</div></details>`:"";
    const oldToc=`<a href="#${target.id}">${target.text}</a>`;
    s=s.slice(0,target.at)+module(target.id,number)+extra+preservation+s.slice(end);
    if(s.includes(oldToc))s=s.replace(oldToc,`<a href="#${target.id}">${number?number+". ":""}Praxisbeispiele und Wissenscheck</a>`);
  }else{
    const insertion=headings.slice().reverse().find(h=>/Quellen|Technische Referenzen|Fachliche Quellen|Validierungsstatus/i.test(h.text));
    if(!insertion)throw Error("Keine sichere Position für Lernbereich "+n);
    const id=`praxisbeispiele-rb-${String(n).padStart(3,"0")}`;
    s=s.slice(0,insertion.at)+module(id,"")+s.slice(insertion.at);
    const toc=s.indexOf('<nav class="support-page-toc"'),endToc=s.indexOf("</ol></nav>",toc);
    if(toc<0||endToc<0)throw Error("Inhaltsverzeichnis fehlt "+n);
    s=s.slice(0,endToc)+`<li><a href="#${id}">Praxisbeispiele und Wissenscheck</a></li>`+s.slice(endToc);
  }
  s=s.replace(/<div class="support-source-path">[\s\S]*?<\/div>/g,"");
  let explanations=0;
  s=s.replace(/(<div class="code-block">[\s\S]*?<code class="language-([^"]+)">)([\s\S]*?)(<\/code><\/pre><\/div>)/g,(whole,start,lang,code,end)=>{
    if(["mermaid","cmd","bat","bash"].includes(lang))return whole;
    const detail=explain(code,lang);
    if(!detail)return whole;
    explanations++;
    return start+code+end+detail;
  });
  s=s.replace("href=\"../../assets/support.css?v=20261108-3\"","href=\"../../assets/support.css?v=20261125-learning\"");
  const answers=(s.match(/<summary>Musterantwort anzeigen<\/summary>/g)||[]).length;
  const examples=(s.match(/class="support-learning-case"/g)||[]).length;
  const codes=(s.match(/class="code-block"/g)||[]).length;
  const opens=(s.match(/<details(?:\s|>)/g)||[]).length,closes=(s.match(/<\/details>/g)||[]).length;
  const ids=new Set([...s.matchAll(/id="([^"]+)"/g)].map(x=>x[1]));
  const dangling=[...s.matchAll(/href="#([^"]+)"/g)].map(x=>x[1]).filter(x=>!ids.has(x));
  if(codes!==originalCode||answers!==5||examples!==2||opens!==closes||dangling.length||s.includes('class="support-source-path"')||!s.includes('class="support-page-toc"'))throw Error(`QA RB${n}: code ${codes}/${originalCode}, answer ${answers}, examples ${examples}, details ${opens}/${closes}, dangling ${dangling}`);
  return {content:s,report:{n,section:target?.text||"neuer Lernabschnitt",explanations,codes,answers,examples,length:s.length}};
})