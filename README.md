# Deutsch Connections

A rather simple NYT Connections clone meant to be used as a learning tool for the Case Western Reserve University's German Club. Connections is a good language learning helper, as it encourages students to think of and connect words in new, creative ways. Additionally, when used with good vocabulary, this can help students learn new things about words, such as their grammatical quirks, meaning, etc.

## Usage

If someone actually stumbles across this, just clone the repo and run with `npm run dev`. To change the words, edit [connections.json](./src/connections.json). The format should look like:

```json
{
  "{farbe}": {
    "answer": "Antwort steht hier",
    "blocks": [
      "Hinweis 1",
      "Hinweis 2",
      ...
    ]
  }
  ...
}
```

Where `{farbe}` is one of `yellow`, `green`, `blue`, and `purple`. These colors are the only colors and must all be defined.