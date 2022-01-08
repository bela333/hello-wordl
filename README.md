# hello wordl
It's [Wordle](https://www.powerlanguage.co.uk/wordle/) but you can play forever!

Play it [here](http://foldr.moe/hello-wordl/).

# Translation
common.json and dictionary.json are generated from http://mokk.bme.hu/resources/webcorpus/ and are licensed under CC BY 2.5 HU
Commands used to generate the files:
`cat web2.2-freq-sorted-lemmatized.txt | awk '{ print tolower($1) }' | grep -E "^[abcdefghijklmnopqrstuvwxyzárvíztűrőtükörfúrógép]{5}$" | head -n 1000 | jq -R '[inputs]' > ../src/common.json`
`cat web2.2-freq-sorted-lemmatized.txt | awk '{ print tolower($1) }' | grep -E "^[abcdefghijklmnopqrstuvwxyzárvíztűrőtükörfúrógép]{5}$" | jq -R '[inputs]' > ../src/dictionary.json`

Translated by bela333