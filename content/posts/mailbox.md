---
title: "A mailbox notifier with Arduino"
date: 2016-01-02T23:42:00+02:00
draft: false
---

My mailbox is located about 200 meters from my house and I must check for new mails every day. So I put my hands dirty and create an SMS notifier with Arduino.

![The hardware](/img/mailbox/preview.jpg)

# The hardware

The system is powered with an Arduino UNO but in order to connect to the GSM network, I needed a GSM shield. As the official Arduino GSM shield was quite expensive (about 90-100$ in France) I ordered the [SIM900 shield](http://wiki.seeedstudio.com/GPRS_Shield_v1.0/) for about 30$. 

The assembly isn't that hard, you just need a few components and some basic electronic knowledge. 

![Arduino diagram](/img/mailbox/diagram.jpg)

The LED and the photoresistor create a barrier in the mailbox. When a mail arrives in the mailbox, the mail "cuts" the barrier and sends a signal to the Arduino board. Then, the Arduino sends an SMS to my phone to notify me that mails arrived.

# The AT protocol

I was disappointed when I saw that the shield wasn't compatible with the official Arduino GSM library and that it used its own protocol instead. Indeed, in order to communicate with the SIM900 modem by Simcom, you must use AT commands. 

On the hardware side, the communication between the Arduino and the SIM900 shield is achieved by a TX/RX transmission on PIN7 and PIN8 of the Arduino (19200 bauds by default). On the software side, you can use the SoftwareSerial library provided by default and the [AT commands](http://simcom.ee/documents/SIM900/SIM900_AT%20Command%20Manual_V1.11.pdf). 

For example, if you wish to make phone call:

```sql
ATD + +336XXXXXXXX
```

If you wish to send an SMS, choose the GSM network and do not forget to enable the text mode over PDU.

```sql
AT+CSCS="GSM"           -- Use GSM network
AT+CMGF=1               -- Prefer text mode
AT+CMGS="18576608994"   -- Set the number
> A test message        -- Your text message
```

# Conclusion

Once done, just upload the program to the Arduino and be happy about the result :)
You can take a look at my work [on my github](https://github.com/obynio/postman). 

![Android sms notification](/img/mailbox/sms.jpg)