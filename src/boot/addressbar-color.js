import { AddressbarColor } from 'quasar'
import { Platform } from "quasar";

export default () => {
  if(!Platform.is.desktop) {
    AddressbarColor.set('#5384ae')
  }
}

import {
  Plugins,
} from '@capacitor/core';

const { StatusBar } = Plugins;

//if not safe area (status bar) color
if(!Platform.is.desktop) {
  StatusBar.setBackgroundColor({color: "#5384ae"})
}
