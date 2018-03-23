import { CourseBatchesComponent } from './../course-batches/course-batches';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ContentService } from 'sunbird';
import { HttpClient } from '@angular/common/http';


/**
 * Generated class for the CourseDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'course-detail',
  templateUrl: 'course-detail.html'
})
export class CourseDetailComponent implements OnInit {

  /**
   * Contains content details
   */
  contentDetail: any;

  /**
   * 
   */
  tabBarElement: any;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation controller 
   */
  public navCtrl: NavController;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains reference of zone service
   */
  public zone: NgZone;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param contentService 
   */
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone, private http: HttpClient, 
    private events: Events) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  /** 
   * To get content details
   */
  getContentDetails() {
    const option = {
      contentId: 'do_212465766404055040181',
      attachFeedback: false,
      attachContentAccess: false,
      refreshContentDetails: false  
    }

    console.log('Making api call to get content details');
    /*this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        console.log('details', data);
        data = JSON.parse(data);
        if (data && data.result) {
          this.contentDetail = data.result.contentData ? data.result.contentData : [];
          if (!data.isAvailableLocally) {
            this.importContent();
          }
        }
      });
    },
    error => {
      console.log('error while loading content details', error);
    });*/

    this.http.get('http://www.mocky.io/v2/5ab3514f2f00000f00ca3665').subscribe(
      (data: any) => {
        console.log('data', data);
        this.contentDetail = data.result.contentData ? data.result.contentData : [];
        if (!data.isAvailableLocally) {
          this.importContent();
        }
      },
      (error: any) => {
        console.log('error while fetching popular courses');
      }
    );

  }


  /**
   * To import content
   */
  importContent(): void {
    console.log('importing content==> ');
    this.showChildrenLoader = true;
    const option = {
      contentImportMap: {
        [0]: {
          isChildContent: false,
          destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
          contentId: 'do_212465766404055040181',
          correlationData: []
        }
      },
      contentStatusArray: []
    }

    this.contentService.importContent(option, (data: any) => {
      console.log('datata', data);
    },
    error => {
      console.log('error while loading content details', error);
    });
  }

  importChildren(): void {
    console.warn('do import children api call ======================> ');
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.getContentDetails();

    this.events.subscribe('genie.event', (data) => {
      data = JSON.parse(data);
      let res = data;
      if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
        this.importChildren();
      }
    });
  }
 
  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.events.unsubscribe('genie.event');
  }

  navigateToBatchListPage(id: string): void {
    this.navCtrl.push(CourseBatchesComponent, { identifier: 'nileshmore===>'});
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    // this.getContentDetails();
  }
}
