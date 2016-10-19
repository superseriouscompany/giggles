//
//  steffigraffitiUITests.swift
//  steffigraffitiUITests
//
//  Created by Neil Sarkar on 19/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import XCTest

class steffigraffitiUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testUploadPhoto() {
      let app = XCUIApplication()
      app.otherElements["See photos"].tap()
      app.otherElements["Upload photo"].tap()
      app.sheets["Santi is a dumb dumb."].buttons["Choose from Library…"].tap()
      app.tables.buttons["Moments"].tap()
      let photosgridviewCollectionView = app.collectionViews["PhotosGridView"]
      photosgridviewCollectionView.swipeUp()
      photosgridviewCollectionView.cells["Photo, Landscape, August 08, 2012, 10:55 PM"].tap()
      sleep(10)
      app.otherElements["Choose later"].tap()
      app.alerts["Added you to the queue"].buttons["OK"].tap()
    }
}
