// About System Application
// Shows system information

const AboutApp = {
  name: 'About System',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAArklEQVR42u2WwQnAIAxF0+K+d+wQneIjHaJTuIcl3MMSagsRQkxM8yEQ/EcIefxEQWvtP4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4Ax5gVgjHkBGGNeAMaYF4AxfwP4AHinM2cYAoV3AAAAAElFTkSuQmCC',
  
  launch() {
    wm.createWindow('About System', 400, 320, (content) => {
      content.style.cssText = 'padding: 20px; display: flex; flex-direction: column; align-items: center;';
      
      const logo = document.createElement('div');
      logo.style.cssText = 'width: 64px; height: 64px; margin-bottom: 16px;';
      logo.innerHTML = `<img src="${this.icon}" style="width: 100%; height: 100%; image-rendering: pixelated;">`;
      
      const title = document.createElement('h2');
      title.style.cssText = 'margin-bottom: 8px; font-size: 14pt;';
      title.textContent = 'CDE Desktop Environment';
      
      const subtitle = document.createElement('div');
      subtitle.style.cssText = 'margin-bottom: 4px; font-size: 10pt;';
      subtitle.textContent = 'Common Desktop Environment';
      
      const version = document.createElement('div');
      version.style.cssText = 'margin-bottom: 16px; font-size: 9pt; color: var(--cde-dark);';
      version.textContent = 'Version 2.5';
      
      const separator1 = document.createElement('hr');
      separator1.style.cssText = 'width: 100%; margin: 16px 0; border: none; border-top: 1px solid var(--cde-dark);';
      
      const systemInfo = document.createElement('div');
      systemInfo.style.cssText = 'font-size: 9pt; line-height: 1.6; text-align: center; margin-bottom: 16px;';
      systemInfo.innerHTML = `
        <strong>UNIX System V Release 4.0</strong><br>
        CDE Simulator for Web Browsers<br>
        <br>
        Based on Motif Window Manager (dtwm)<br>
        © 1995-2025 The Open Group
      `;
      
      const separator2 = document.createElement('hr');
      separator2.style.cssText = 'width: 100%; margin: 16px 0; border: none; border-top: 1px solid var(--cde-dark);';
      
      const credits = document.createElement('div');
      credits.style.cssText = 'font-size: 8pt; color: var(--cde-dark); text-align: center; margin-bottom: 16px;';
      credits.innerHTML = `
        Simulating the classic Motif/CDE<br>
        desktop experience from the 1990s.<br>
        <br>
        Build Date: ${new Date().toLocaleDateString()}
      `;
      
      const okBtn = GUI.createDefaultButton('OK', () => {
        wm.closeWindow(content.parentElement.id);
      });
      
      content.appendChild(logo);
      content.appendChild(title);
      content.appendChild(subtitle);
      content.appendChild(version);
      content.appendChild(separator1);
      content.appendChild(systemInfo);
      content.appendChild(separator2);
      content.appendChild(credits);
      content.appendChild(okBtn);
    }, { noMinimize: true, noMaximize: true, noResize: true });
  }
};

