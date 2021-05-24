#!/bin/sh

for i in 48 72 96 144 192 512 
do
    inkscape -z -w $i -h $i icon.svg -e "icon_$i.png"
done

inkscape -z -w 16 -h 16 icon.svg -e "../favicon.ico"