class SameSiteCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)


        if 'access_token' in response.cookies:
            response.cookies['access_token']['samesite'] = 'Lax'
            response.cookies['access_token']['secure'] = 'True'
            
        if 'refresh_token' in response.cookies:
            response.cookies['refresh_token']['samesite'] = 'Lax'
            response.cookies['refresh_token']['secure'] = 'True'

        #    response.set_cookie('refresh_token2',
        #            value=str(response.cookies.get('refresh_token', None).value),
        #           samesite='Lax',
        #            secure=True,
        #            httponly=True)
        
        #print("Cookies in response:", response.cookies)

        return response