#!/usr/bin/env node

var usb = require('usb');
var async = require('async');

async.map(usb.getDeviceList(), function (d, next) {
  try {
    d.open();
    d.getStringDescriptor(d.deviceDescriptor.iManufacturer, function (err, data) {
      d.manufacturer = data;
      d.getStringDescriptor(d.deviceDescriptor.iProduct, function (err, data) {
        d.product = data;
        d.close();
        next(null, d);
      });
    });
  } catch (e) {
    try {
      d && d.close();
    } catch (e) {}
    next(null, d);
  }
}, function (err, list) {
  list.forEach(function (d) {
    console.log('Bus', ('000' + d.busNumber).slice(-3),
      'Device', ('000' + d.deviceAddress).slice(-3) + ':',
      'ID', ('0000' + d.deviceDescriptor.idVendor.toString(16)).slice(-4) + ':' +
          ('0000' + d.deviceDescriptor.idProduct.toString(16)).slice(-4),
      d.manufacturer || '', d.product || '');
    try { d.close(); } catch (e) { };
  });
  process.exit(0);
})
