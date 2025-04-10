import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/orders';
  urlOrderDetails = 'https://localhost:7111/api/orderDetails';
  urlReviews = 'https://localhost:7111/api/reviews';
  urlNganHang = 'https://script.googleusercontent.com/macros/echo?user_content_key=ENnwvJfXRYUwvuEgUXJhFQhDfeJdlwBYYO5a8Ox-a0IIjQax-lz7Vf8d4UyDrDK6S1QX0cVLVQY-O4ms9ahE7Jxq6GbOgRKom5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNCUaPUBmbIwF7b8DiSFaeZCzAIodce8h_RivxO2IvT_UXRCwriyvyzQTp6qhGA0J0xQT8APAqG2NKJlBg3kVUmNYjOEVPmtwA&lib=MK3RoRVaPzSOwqCAUHf3RT0TUDqEcDcnD';
  constructor(
    private http: HttpClient,
  ) { }

  postOrder(body: any): Observable<any>{
    return this.http.post(`${this.url}`, body, this.httpOptions);
  }

  postOrderDetail(body: any): Observable<any>{
    return this.http.post(`${this.urlOrderDetails}`, body, this.httpOptions);
  }

  getListDonHang(idAccount: any):  Observable<any>
  {
    return this.http.get(`${this.url}/getlistdonhangbyaccountid/${idAccount}`, this.httpOptions);
  }

  getDonHangById(idDonHang: any):  Observable<any>
  {
    return this.http.get(`${this.url}/${idDonHang}`, this.httpOptions);
  }

  getListSanPhamByIDDonHang(idDonHang: any, userId: any):  Observable<any>
  {
    return this.http.get(`${this.urlOrderDetails}/getlistsanphambyiddonhang/${idDonHang}/${userId}`, this.httpOptions);
  }

  huyDonHangById(idDonHang: any, don: any): Promise<any>
  {
    return this.http.put(`${this.url}/huyDonHang/${idDonHang}`, don, this.httpOptions).toPromise();
  }

  suaSanPhamTrongDonHang(idSanPham: any, idDonHang: any, kichCo: any, mau: any): Promise<any>
  {
    return this.http.put(`${this.urlOrderDetails}/suasanphamdonhang/${idSanPham}/${idDonHang}/${kichCo}/${mau}`,this.httpOptions).toPromise();
  }

  getDanhGiaVeSanPhamByAccount(sanPhamId: any, accountId: any): Observable<any>
  {
    return this.http.get(`${this.urlReviews}/getdanhgiavesanphambyaccount/${sanPhamId}/${accountId}`, this.httpOptions);
  }

  postDanhGia(body: any): Observable<any>
  {
    return this.http.post(this.urlReviews, body, this.httpOptions);
  }

  getReviewByBookId(bookId: any):Observable<any>
  {
    return this.http.get(`${this.urlReviews}/getReviewByBookId/${bookId}`, this.httpOptions);
  }
  // postAnh(body: any): Observable<any>
  // {
  //   return this.http.post(this.urlAnhDanhGia, body, this.httpOptions);
  // }


  getThanhToan(): Observable<any>{
    return this.http.get(this.urlNganHang);
  }

}


