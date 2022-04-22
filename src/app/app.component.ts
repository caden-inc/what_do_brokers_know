import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Typed } from 'typed.ts';
import { OnInit } from '@angular/core';
import { GeolocateService } from './geolocate.service';
import { ApiService } from './api.service';

const EMAIL_PROMPT = "Enter your email to get started > ";

const INIT_TEXT =  
  `**********************************************
   ****************** CADEN.IO ******************
   ************ WHAT DO DATA BROKERS ************
   *************** KNOW ABOUT ME? ***************
   **********************************************`

const LOAD_TEXT = `LOADING C:\\\\creep.exe`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollable') private scrollable!: ElementRef;
  @ViewChild('input') private inputField!: ElementRef;
  
  typedText: Array<any> = [];
  typingText: string = '';
  readyForInput: boolean = false;
  prefixText: string = EMAIL_PROMPT;
  inputText: string = '';
  isEmailSubmitted = false;
  data: any;
  hasData: boolean = false;
  currentIndex = 0;
  currentScrollHeight = document.documentElement.scrollHeight;
  failedEmail: boolean = false;
  typingColor: string = 'white'
  showShare: boolean = false;

  typed: Typed = new Typed({callback: (text) => this.typingText = text});
  
  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    if (this.readyForInput) {
      switch (event.key) {
        case 'Enter':
          await this.submit();
          break;
        case 'Escape':
          await this.rickroll();
          break;
      }  
    }    
  }

  get typedKeys() {
    return this.typedText.keys();
  }

  constructor(private geo: GeolocateService, private api: ApiService) {}

  async ngOnInit() {
    await this.initialType();
  }

  scroll() {
    const h = document.documentElement.scrollHeight;

    if (h != this.currentScrollHeight) {
      this.currentScrollHeight = h;
      window.scroll(0, h);
    }
  }

  async ngAfterViewChecked() {
    try {
      this.scroll();

      if (this.inputField) {
        this.inputField.nativeElement.focus();
      }
    } catch(err) {
      console.log(err);
    } 
  }

  async submit() {
    this.readyForInput = false;

    if (this.isEmailSubmitted) {
      await this.handleInput();
    } else if (!this.inputText.replace(/\s/g, '').length) {
      this.typedText.push({
        text: [
          {
            text: this.prefixText,
            color: 'white'
          },
          {
            text: this.inputText,
            color: 'green'
          }
        ]
      });
      await this.promptInput(EMAIL_PROMPT);
    } else {
      await this.submitEmail()
    }
  }

  private async handleInput() {
    this.typedText.push({
      text: [
        {
          text: this.prefixText,
          color: 'white'
        },
        {
          text: this.inputText,
          color: 'green'
        }
      ]
    });

    const input = this.inputText.toLowerCase();
    
    if (input == 'no' || input == 'n') {
      await this.terminate();
    } else {
      await this.typeNextData();
    }
  }

  private async failedTerminate() {
    await this.addLine('TERMINATING C:\\\\creep.exe', 'red');
    await this.addLine('TERMINATED.', 'green');

    await this.typeLine(`Well look at that, we couldn’t find you! (yet)`);
    await this.typeLine(`However, it may only be a matter of time before big data brokers slurp up your personal data and list it for sale on the open web for a fraction of a penny.`);
    await this.typeLine(`We (Caden), are a startup in NYC that is building a platform to help you control, own, protect and make money off your data, all while protecting your privacy. The internet is riddled with all sorts of problems and we are working to make the internet a better place.`);
    await this.typeLine(`We’ll let you know when our Beta launches this summer.`);
    await this.typeLine(`You can also follow our journey on Instagram and Twitter.`);
    this.showShare = true;
  }

  private async terminate() {
    await this.addLine('TERMINATING C:\\\\creep.exe', 'red');
    await this.addLine('TERMINATED.', 'green');

    await this.typeLine(`Want to know WTF just happened?`);
    await this.typeLine(`This is just a tiny snapshot of your data that is for sale on the open web. It cost us a fraction of a penny to buy.`);
    await this.typeLine(`We're Caden, a startup in NYC that is building a platform to help folks like you control, own, protect and make money off your data, all while protecting your privacy. The internet is riddled with all sorts of problems and we are working to make the internet a better place`)
    await this.typeLine(`We’ll let you know when our Beta launches this summer.`);
    await this.typeLine(`You can also follow our journey us on Instagram and Twitter.`);
    await this.typeLine(`Don’t worry, we didn’t do anything nefarious with the data we showed you above. This was just a creepy art project to demonstrate one of many issues around personal data and the endless surveillance that you never signed up for.`)
    await this.typeLine(`We look forward to solving these problems together.`);
    this.showShare = true;
  }

  get isValidEmail(): boolean {
    return new Boolean(this.inputText.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )).valueOf();
  }

  // TODO implement failed email
  private async submitEmail() {
    this.typedText.push({
      text: [
        {
          text: this.prefixText, 
          color: 'white'
        }, 
        {
          text: this.inputText, 
          color: 'green'
        }
      ]
    });

    if (this.isValidEmail) {
      await this.typeLine('SEARCHING THE WEB...', undefined, 'lightseagreen');
      await this.pullData();
      await this.typeLine('BUYING YOUR DATA...', undefined, 'lightseagreen');
  
      if (this.hasData) {
        this.pullDataSuccess(); 
      } else {
        // Second failed email
        if (this.failedEmail) {
          await this.failedTerminate();
        } else {
            // request another email
          this.typedText.push({
            text: [{
              text: `Wow... you're well hidden! We couldn’t buy any data.`,
              color: 'white'
            }]
          });
  
          this.isEmailSubmitted = false;
          this.failedEmail = true;
          this.promptInput('Try another email address > ');
        }
      }
    } else {
      // invalid email format
      await this.invalidEmailPrompt();
    }    
  }

  private async invalidEmailPrompt() {
    await this.typeLine(`What's '${this.inputText}'? Doesn't look like an email address 🤔`, [
      {
        text: `What's '`,
      },
      {
        text: this.inputText,
        color: 'red'
      },
      {
        text: `'? Doesn't look like an email address 🤔`
      }
    ]);
    await this.promptInput(`Let's try an actual email this time > `);
  }

  private async pullDataSuccess() {
    if (this.data.name) {
      await this.typeLine(`OK ${this.data.name}, let's do this...`, [
        {
          text: "OK ",
        }, {
          text: this.data.name,
          color: 'green'
        }, {
          text: `, let's do this...`
        }
      ]);
    }

    await this.typeLine(`Wow, there's a lot out there...`);
    await this.typeLine(`Analyzing...`, undefined, 'green');
    await this.typeLine(`Analyzing...`, undefined, 'green');
    await this.typeLine(`Analyzing...`, undefined, 'green');

    await this.typeNextData();

    this.isEmailSubmitted = true;
  }

  private async typeNextData() {
    switch(this.currentIndex) {
      case 0:
        if (this.data.hasPhone) {
          await this.typeLine('Check your phone ;)');
        }

        if (this.data.title) {
          await this.typeLine(`A ${this.data.title}... fancy`)
        }
    
        if (this.data.addresses && this.data.addresses.length != 0) {
          await this.typeLine('Remember living in any of these?');
          
          for (let ad of this.data.addresses) {
            await this.addLine(ad, 'red');
          }
        }

        await this.typeLine('Want to see more?');
        await this.promptInput('[Y]es / [N]o, this is too creepy > ');

        break;
      case 1:
        await this.typeAfterFirstPrompt();
        break;
      case 2:
        await this.typeAfterSecondPrompt();
        break;
      default:
        break;
    }

    this.currentIndex++;
  }

  private async typeAfterFirstPrompt() {
    if (this.data.birthday) {
      if (this.data.birthday.sign) {
        await this.typeLine(`Astrological sign: ${this.data.birthday.emoji}`);

        if (this.data.birthday.age) {
          await this.typeLine(`A ${this.data.birthday.age} year old ${this.data.gender ? this.data.gender : ''} ${this.data.birthday.sign}? You may need a hug today.`);
        }

        if (this.data.birthday.isCurrentZodiac) {
          await this.typeLine(`Woo! it's ${this.data.brithday.sign} season!`);
        }
      }
    }

    if (this.data.workplaces && this.data.workplaces.length != 0) {
      await this.typeLine('THESE LOOK LIKE FUN PLACES TO WORK...');

      for (let w of this.data.workplaces) {
        await this.addLine(w, 'red');
      }
    }

    if (this.data.associates && this.data.associates.length != 0) {
      await this.typeLine('AND THESE LOOK LIKE FUN PEOPLE TO WORK WITH...');

      for (let assc of this.data.associates) {
        await this.addLine(assc, 'red');
      }
    }

    if (this.data.skills && this.data.skills.length != 0) {
      await this.typeLine('HOPE YOUR WORK VALUES ALL THE AMAZING SKILLS YOU HAVE...');

      for (let s of this.data.skills) {
        await this.addLine(s, 'red');
      }
    }

    if (this.data.school) {
      await this.typeLine(`OH SMARTY PANTS, LOOKS LIKE YOUR SKILLS WERE HONED AT ${this.data.school}?`);
    }

    await this.typeLine('Want to see more?');
    await this.promptInput('[Y]es... I think / [N]o, make it stop > ');
  }

  private async typeAfterSecondPrompt() {
    await this.typeLine(`WE'RE GOING IN!`);

    if (this.data.social_handles) {
      await this.typeLine(`GENTLY CREEPING ON YOUR SOCIAL MEDIA...`);
      await this.typeLine('Analyzing...', undefined, 'green');

      for (let s of this.data.social_handles) {
        await this.addLine(`${s}`);
      }
    }

    if (this.data.instagram) {
      await this.typeLine(`LOOK FAMILIAR?`);

      await this.typedText.push({
        isImage: true,
        url: this.data.instagram.profile
      });

      if (this.data.instagram.posts && this.data.instagram.posts.length != 0) {
        await this.typeLine(`HOW ABOUT THESE MEMORIES YOU'VE MADE?`);
      } else if (!this.data.instagram.isPublic) {
        await this.typeLine(`HAVE YOU POSTED TO IG RECENTLY? YOU HAVE ${this.data.instagram.followers} REASONS TO SHARE AN UPDATE`);
      }
    }

    await this.typeLine(`Ok, enough of that, we're officially creeped out.`)
    await this.terminate();
  }


  // TODO pull real data
  private async pullData() {
    const res: any = await this.api.requestByEmail(this.inputText, false);

    console.log(res);

    if (res.hasOwnProperty('body')) {
      this.data = res['body'];
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  private promptInput(prefix?: string) {
    if (prefix) {
      this.prefixText = prefix;
    }

    this.inputText = '';
    this.readyForInput = true;
  }

  async initialType() {
    for (let str of INIT_TEXT.split('\n')) {
      await this.addLine(str);
    }

    await this.typeLine(LOAD_TEXT);
    await this.typeLine('LOADED.', undefined, 'green');

    await this.typeGeoLocation();

    this.promptInput();
  }

  async typeGeoLocation() {
    const ip = await this.geo.getIpAddress();
    const locRes = await this.geo.getLocationFromIp(ip);

    const ipStr = "IP Address: " + ip;
    await this.typeLine(ipStr, [
      {
        text: "IP Address: "
      }, 
      {
        text: ip,
        color: 'red'
      }
    ]);

    const isVpn: boolean = this.geo.isVpn(locRes);

    if (!isVpn) {
      const locStr: string = "Location: " + this.geo.locationStr(locRes);
      await this.typeLine(locStr, [
        {
          text: "Location: "
        }, 
        {
          text: this.geo.locationStr(locRes),
          color: 'red'
        }
      ]);
    } else {
      const vpnStr = "Impressive, you're using a VPN?";
      await this.typeLine(vpnStr, undefined, 'green');
    }
  }

  async addLine(line?: string, color?: string, styledLine?: Array<any>) {
    await new Promise(f => setTimeout(f, 300));

    if (color) {
      this.typingColor = color;
    }

    if (line) {
      this.typedText.push({
        text: [{
          text: line,
          color: color ? color : 'white'
        }]
      });
    } else if (styledLine) {
      this.typedText.push({
        text: styledLine
      });
    }

    this.typingColor = 'white'
  }

  async typeLine(line: string, typed?: Array<any>, color?: string) {
    if (color) {
      this.typingColor = color;
    }

    this.typed
      .type(line, {errorMultiplier: 0, noSpecialCharErrors: true, perLetterDelay: {min: 60, max: 60}});

    await this.typed.run();

    // await this.addElipses();
    await this.typed.reset(true);

    if (typed) {
      this.typedText.push({
        text: typed
      });
    } else {
      this.typedText.push({
        text: [{
          text: line,
          color: color ? color : 'white'
        }]
      });
    }

    this.typingColor = 'white';
  }

  async rickroll() {
    this.readyForInput = false;
    await this.typeLine('BOOTING UP SECONDARY PROCESS...', undefined, 'red');
    await this.typeLine('RUNNING C:\\\\rickroll.exe', undefined, 'green');

    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");

    await this.addLine('RESUMING C:\\\\creep.exe')
    await this.addLine(undefined, undefined, [{
      text: 'RESUMED.',
      color: 'green'
    }]);
    
    this.readyForInput = true;
  }

  get canNativeShare(): boolean {
    const navigator = window.navigator as any;

    if (navigator.share) {
      return true;
    } else {
      return false;
    }
  }

  share() {
    const navigator = window.navigator as any;

    if (navigator.share) {
      navigator.share({title: "What Do Data Brokes Know?"});
    } else {

    }
  }

  // async addElipses() {
  //   this.typed
  //     .type('...', {noSpecialCharErrors: true, perLetterDelay: {min: 20, max: 20}})
  //     .backspace(3)
  //     .type('...', {noSpecialCharErrors: true, perLetterDelay: {min: 20, max: 20}})
  //     .backspace(3)

  //   await this.typed.run();
  // }
}