// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const { dialogflow, Carousel, Permission, Suggestions } = require('actions-on-google'); 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// URLs for images used in card rich responses
const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDpB0ECJpBOIwFqYwmwTA7zxceMBNJwSTMMineEBM0VXklM2k';
const imageUrl2 = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const linkUrl = 'https://assistant.google.com/';
// Instantiate the Dialogflow client.
const app = dialogflow();

// Fund Managers
const managers = {
	"1": "Harry Nimmo,SLI UK Smaller Companies Ret Acc, Average annual returns 14.15%,Male,BSc,Oxford",
	"2" : "Daniel Nickols,Old Mutual UK Smaller Companies Acc,Average annual returns 13.91%,Male,MSc,Cambridge",
	"3" : "Michael Lindsell & Nick Train,CF Lindsell Train UK Equity Acc,Average annual returns 12.04%,Male,PhD,ETH  Zurich",
	"4" : "Anthony Cross & Julian Fosh,Liontrust UK Smaller Companies Inc,Average annual returns 11.97%,Male,A Levels,Harvard",
	"5" : "James de Uphaugh & Chris Field,Majedie UK Equity A Acc,Average annual returns 11.21%,Male,PhD,MIT",
	"6": "Richard Newbery & Alistair Whyte,Aberforth UK Small Companies Acc,Average annual returns 11.06%,Male,BA,Glasgow",
	"7": "Andy Brough & Rosemary Banyard,Schroder UK Smaller Companies A Inc,Average annual returns 10.6%,Male,MA English,ETH Zurich",
	"8": "Richard Buxton,Old Mutual UK Alpha R Acc,Average annual returns 10.49%,Male,Chemist,Geneva",
	"9": "Neil Woodford,CF Woodford Equity Income,Average annual returns 10.38%,Male,MS Phychology,Oxford",
	"10": "Audrey Ryan,Kames Ethical Equity A Acc,Average annual returns 9.34%,Male,MBBS,Cambridge",
	"11": "Georgina Brittain,JPM UK Smaller Companies A Acc,Average annual returns 9.94%,Male,Engineering,ETH  Zurich",
	"12": "Nigel Thomas,AXA Framlington UK Select Opps R Acc,Average annual returns 9.84%,Male,Army,Harvard",
	"13": "Matt Hudson,Schroder UK Alpha Income A Inc,Average annual returns 9.28%,Male,BSc,MIT",
	"14": "Mark Costar,JOHCM UK Growth B GBP,Average annual returns 9.01%,Male,MSc,Glasgow",
	"15": "Lesley Duncan,SLI UK Ethical Ret Acc,Average annual returns 9%,Male,PhD,ETH Zurich",
	"16": "Alistair Munday,Investec UK Special Situations A Inc Net,Average annual returns 8.65%,Male,A Levels,Geneva",
	"17": "Adrian Frost & Adrian Gosden,Artemis Income Inc,Average annual returns 8.45%,Male,PhD,Oxford",
	"18": "Jan Luthman & Stephen Bailey,Liontrust Macro Equity Income,Average annual returns 8.43%,Male,BA,Cambridge",
	"19": "Andrew Green,GAM UK Diversified Acc,Average annual returns 8.43%,Male,MA English,ETH  Zurich",
	"20": "Derek Stuart,Artemis UK Special Situations R Acc,Average annual returns 8.35%,Male,Chemist,Harvard",
	"21": "Carl Stick,Rathbone Income R Inc,Average annual returns 8.07%,Male,MS Phychology,MIT",
	"22": "Stephen Adams,Kames UK Equity E Acc,Average annual returns 7.97%,Male,MBBS,Glasgow",
	"23": "Karen Robertson,SLI UK Equity High Income Ret Inc,Average annual returns 7.93%,Male,Engineering,ETH Zurich",
	"24": "Jullian Chillingworth,Rathbone Blue Chip Income And Growth,Average annual returns 7.9%,Male,Army,Geneva",
	"25": "Tom Dobell,M&G Recovery A Acc,Average annual returns 7.59%,Male,PhD,Cambridge"
}

const news = {
	"1": new Card({
		    title: 'UBS Asset Management',
		    imageUrl: 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F936413626%2F960x0.jpg%3Ffit%3Dscale',
		    text: 'UBS Asset Management Taps Alternative Data to Increase Alpha',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.forbes.com/sites/ciocentral/2018/11/18/ubs-asset-management-taps-alternative-data-to-increase-alpha/#d5c00a15d3a4'
		}),
	"2": new Card({
		    title: 'Asset Managers Are Drowning, Not Waving',
		    imageUrl: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iwihBrvkjg2w/v1/1000x-1.jpg',
		    text: 'Profits have been flattered by rising markets. With markets lackluster this year, expect mid-sized firms to struggle most.',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.bloomberg.com/opinion/articles/2018-11-20/asset-managers-are-drowning-not-waving'
		}),
	"3": new Card({
		    title: 'Silvercrest Asset Management Group: An Under-Covered Stock Worth A Second Look',
		    imageUrl: 'https://static.seekingalpha.com/uploads/2018/11/17/saupload_a6a53084b8880d44a129fe9be9f29140.png',
		    text: 'Silvercrest Asset Management Group: An Under-Covered Stock Worth A Second Look',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://seekingalpha.com/article/4223146-silvercrest-asset-management-group-covered-stock-worth-second-look'
		}),
	"4": new Card({
		    title: 'Robeco Institutional Asset Management',
		    imageUrl: 'https://www.marketbeat.com/scripts/SECFilingChart.ashx?Prefix=NASDAQ&Symbol=NMIH',
		    text: 'Robeco Institutional Asset Management B.V. Takes Position in NMI Holdings Inc (NMIH)',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.fairfieldcurrent.com/2018/11/24/robeco-institutional-asset-management-b-v-takes-position-in-nmi-holdings-inc-nmih.html'
		}),
	"5": new Card({
		    title: 'Victory Capital to acquire USAA Asset Management: News Scan',
		    imageUrl: 'https://assets.sourcemedia.com/dims4/default/14049ca/2147483647/thumbnail/250x160%3E/quality/90/?url=https%3A%2F%2Fassets.sourcemedia.com%2Fd5%2Fb4%2F24f7431c424ea159e2531c25d45a%2Fhoward-milstein-2008.jpg',
		    text: 'Victory Capital Holdings announced that it will acquire USAA Asset Management, a company managing $69.2 billion in AUM and 53 investment funds',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.financial-planning.com/news/victory-capital-to-acquire-usaa-asset-management'
		}),
	"6": new Card({
		    title: 'Funds lose $29B last month, most in 3 years',
		    imageUrl: 'https://assets.sourcemedia.com/dims4/default/d6b198c/2147483647/resize/680x%3E/quality/90/?url=https%3A%2F%2Fassets.sourcemedia.com%2Ffb%2Faa%2F0cbb48cb42298182928a9d02bef1%2F323482440-1-4.jpg',
		    text: 'Investors pulled more money out of stock and bond funds in October than in any month in more than three years.',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.financial-planning.com/articles/stock-bond-funds-lose-most-money-in-over-three-years'
		}),
	"7": new Card({
		    title: 'Firm with top-performing ETFs plans new fund focused on fintech: Fund Scan',
		    imageUrl: 'https://assets.sourcemedia.com/dims4/default/de58c50/2147483647/resize/680x%3E/quality/90/?url=https%3A%2F%2Fassets.sourcemedia.com%2F71%2Fb7%2F25b476374b2483769f6cc7dcfa9c%2F314318659-1-6.jpg',
		    text: 'Ark Investment Management, which currently runs the two top-performing ETFs over the last three years, announced plans to launch a new ETF focused on fintech, according to Bloomberg News',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.financial-planning.com/news/ark-investment-management-to-launch-new-fund-focused-on-fintech'
		}),
	"8": new Card({
		    title: 'Assets balloon in gender equality funds, but do they work?',
		    imageUrl: 'https://assets.sourcemedia.com/dims4/default/6e17586/2147483647/resize/680x%3E/quality/90/?url=https%3A%2F%2Fassets.sourcemedia.com%2Fbf%2F79%2F81c1a94b41449cac5830394c471c%2Fbar-template-v2-25.png',
		    text: 'As more clients make investments based on their personal values, there’s a growing interest in funds relating to gender equality',
		    buttonText: 'Read ...',
		    buttonUrl: 'https://www.financial-planning.com/news/assets-balloon-in-gender-equality-funds-but-do-they-work'
		})

}
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 


// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  const name = conv.user.storage.userName;
  if (!name) {
    // Asks the user's permission to know their name, for personalization.
    conv.ask(new Permission({
      context: 'Hi there, to get to know you better',
      permissions: 'NAME',
    }));
  } else {
    conv.ask(`Hi again, ${name}. How can I help you?`);
  }
});

 // Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. How may I help you? ?`);
    conv.ask(new Suggestions('Password Reset', 'Fund Manager', 'Fund News', 'Data Feed', 'Fund Documents'));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. How can I help you?`);
    conv.ask(new Suggestions('Password Reset', 'Fund Manager', 'Fund News', 'Data Feed', 'Fund Documents'));
  }
});
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
	}
	function rich(app)
	{
		
		agent.add('The latest news is: '); 
		agent.add(news[Math.floor(Math.random() * 8) + 1]);
		agent.add(news[Math.floor(Math.random() * 8) + 1]);
		agent.add(news[Math.floor(Math.random() * 8) + 1]);
	}
function welcome(agent) {

	//let conv = agent.conv();
	agent.add(`Welcome to UBS Fund Navigator!`);
	agent.add(`How can I help you today?`);
	agent.add(new Suggestion('Fund Queries or Help','Password Reset', 'Fund Manager', 'Fund News', 'Data Feed', 'Fund Documents'));
	//conv.ask('How can I help you?');
    //conv.ask(new Suggestions('Password Reset', 'Fund Manager', 'Fund News', 'Data Feed', 'Fund Documents'));
    
    //agent.add(conv);

}
function fundManager(app)
	{
		//agent.add(`According to Morningstar the fund manager is: ` + managers[Math.floor(Math.random() * 25) + 1]);
		agent.add(`According to Bloomberg the fund manager is: ` + managers[Math.floor(Math.random() * 25) + 1]);
	}
function help(agent) {
    let conv = agent.conv(); // Get Actions on Google library conversation object
    conv.ask('Currently I can help with any of the following, Please choose one of the option:'); // Use Actions on Google library to add responses
    conv.ask(new Carousel({
      title: 'UBS Fund Navigator Assistant',
      items: {
        'Password Rest': {
          title: 'Password Reset',
          description: 'Please choose, if you would like to reset password.',
          image: {
            url: imageUrl,
            accessibilityText: 'Password rest logo',
          },
        },
        'Fund Document': {
          title: 'Fund Document',
          description: 'Please choose, if you want to download fund documents.',
          image: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRqCLgjh0Bz97O8So2HyOE-W1LDH6e_hMzJNSSb9vaNmF39VJ0iA',
            accessibilityText: 'Fund Documents'
          },
        },
        'Fund Managers': {
          title: 'Fund Managers',
          description: 'Please choose, if you would like to know the fund manager details',
          image: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSoOoDaDBuCJNFe-bEbBYpghS9kMM4nJLGDfCO5FyDqjFKJDb',
            accessibilityText: 'Fund Managers'
          },
        },
        'Fund News': {
          title: 'Fund News',
          description: 'Please choose, this if you would like to know the latest news.',
          image: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6hyW6tydJ1B8VSPevhVsobfzFT356uXiyZwomzuuY5To8ufl6',
            accessibilityText: 'Fund News'
          },
        },
        'Feed': {
          title: 'Feed',
          description: 'Please choose this, if you have any issues with the feed.',
          image: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz88HfyZ4nUtCPmyuh9FoIXUtLsiuilKeHbyGjLG1gUknH4yTw2Q',
            accessibilityText: 'Feed'
          },
        },
        'Fund Statistics': {
          title: 'Fund Statistics',
          description: 'Please choose this, if you want to find out the fund statistics.',
          image: {
            url: 'https://blogs.wf.com/assetmanagement/wp-content/uploads/sites/19/2017/01/011017-ComparingApples-InfoGraph.png',
            accessibilityText: 'Feed'
          },
        },
      },
    }));
    // Add Actions on Google library responses to your agent's response
    agent.add(conv);
  }
function handleInputDemo(app) {
	let conv = agent.conv(); // Get Actions on Google library conversation object
    conv.ask('Currently I can help with any of the following, Please choose one of the option:'); 
	conv.ask(new Carousel({
      title: 'UBS Fund Navigator Assistant',
      items: {'A':{title:'1st', description:'first', 
      image:{
      	url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz88HfyZ4nUtCPmyuh9FoIXUtLsiuilKeHbyGjLG1gUknH4yTw2Q',
      	accessibilityText:'text'
      },
  },
},
}));

agent.add(conv);
}
function buildOptionItem(app, aString) {
    // Provide a key which is unique to each option.
    // And synonyms that the user can say alternativly to the title
    return app.buildOptionItem(`KEY_${aString}`, aString)
        .setTitle(`Option ${aString}`)
        // Description and image are optional.
        .setDescription(`Description for ${aString}`)
        .setImage('https://example.com/image.jpg', 'An image')
}
function handleInputDemoOption(app) {
    switch (app.getSelectedOption()) {
        case 'KEY_A': 
            return app.tell('Option A is a solid choice.')
        default:
            return app.tell('I would prefer Option A.')
    }
}
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('FundNews', rich);
  intentMap.set('FundManager', fundManager);
  intentMap.set('Help', help);
  intentMap.set('input.demo', handleInputDemo);
  intentMap.set('DemoIntent', handleInputDemo);
  intentMap.set('input.demo.option', handleInputDemoOption);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
