var adUnits = [{
    code: 'div-gpt-ad-123456789-0',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: '11092459'
        }
    }, {
        bidder: 'rubicon',
        params: {
            accountId: '12345',
            siteId: '67890',
            zoneId: '101112'
        }
    }]
}];

// Prebid.js and ad units configuration
pbjs.que = pbjs.que || [];
pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.setConfig({
        debug: true,
        priceGranularity: 'high',
        floormap: {
            currency: 'USD',
            schema: {
                '*': {
                    '300x250': 0.05,
                    '728x90': 0.10
                }
            }
        },
        analytics: [{
            provider: 'ga',
            options: {
                trackingId: 'UA-XXXXXX-X'
            }
        }]
    });

    // Error handling
    pbjs.onEvent('auctionInit', function(data) {
        console.log('Auction Init:', data);
    });

    pbjs.onEvent('bidResponse', function(data) {
        // Validate bid details
        if (!data || data.cpm < 0.05) {
            console.error('Invalid bid:', data);
        }
    });

    pbjs.onEvent('bidTimeout', function(data) {
        console.error('Bid Timeout:', data);
    });

    pbjs.requestBids({
        bidsBackHandler: function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        },
        timeout: 2000
    });
});
