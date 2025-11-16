import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid) {
    await InAppWebViewController.setWebContentsDebuggingEnabled(true);
  }
  runApp(const FaceCalendarApp());
}

class FaceCalendarApp extends StatelessWidget {
  const FaceCalendarApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Face Calendar',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2BA0A0)),
        useMaterial3: true,
      ),
      home: const WebShell(),
    );
  }
}

class WebShell extends StatefulWidget {
  const WebShell({super.key});
  @override
  State<WebShell> createState() => _WebShellState();
}

class _WebShellState extends State<WebShell> {
  // 배포 후 실제 프로덕션 도메인으로 교체하세요.
  final Uri startUrl = Uri.parse('https://face-calendar-landing.vercel.app');
  final pullToRefreshController = PullToRefreshController();
  InAppWebViewController? controller;
  double progress = 0;
  bool offline = false;

  @override
  void initState() {
    super.initState();
    Connectivity().onConnectivityChanged.listen((result) {
      setState(() => offline = result == ConnectivityResult.none);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            InAppWebView(
              initialUrlRequest: URLRequest(url: startUrl),
              initialSettings: InAppWebViewSettings(
                mediaPlaybackRequiresUserGesture: true,
                allowsInlineMediaPlayback: true,
                javaScriptEnabled: true,
                transparentBackground: false,
                useOnDownloadStart: true,
                cacheEnabled: true,
                verticalScrollBarEnabled: true,
              ),
              pullToRefreshController: pullToRefreshController
                ..onRefresh = () async {
                  debugPrint('[webview] pull-to-refresh');
                  if (Platform.isAndroid) {
                    await controller?.reload();
                  } else {
                    final u = await controller?.getUrl();
                    await controller?.loadUrl(urlRequest: URLRequest(url: u));
                  }
                },
              onWebViewCreated: (c) {
                controller = c;
                debugPrint('[webview] created');
              },
              onProgressChanged: (c, p) {
                setState(() => progress = p / 100);
                if (p == 100) pullToRefreshController.endRefreshing();
              },
              onPermissionRequest: (c, req) async {
                debugPrint('[webview] onPermissionRequest: ${req.resources}');
                return PermissionResponse(
                  resources: req.resources,
                  action: PermissionResponseAction.GRANT,
                );
              },
              shouldOverrideUrlLoading: (c, nav) async {
                final uri = nav.request.url;
                if (uri == null) return NavigationActionPolicy.ALLOW;
                // tel:, mailto:, 앱 딥링크 외부 처리
                if (!['http', 'https', 'file', 'about', 'data']
                    .contains(uri.scheme)) {
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                    return NavigationActionPolicy.CANCEL;
                  }
                }
                return NavigationActionPolicy.ALLOW;
              },
              onReceivedError: (c, req, err) {
                debugPrint('[webview] error: ${err.description}');
                pullToRefreshController.endRefreshing();
                setState(() => offline = true);
              },
              onLoadStop: (c, u) async {
                pullToRefreshController.endRefreshing();
                setState(() => offline = false);
                debugPrint('[webview] loaded: $u');
              },
            ),
            if (progress < 1.0) LinearProgressIndicator(value: progress),
            if (offline)
              Positioned.fill(
                child: Container(
                  color: Colors.white,
                  alignment: Alignment.center,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('오프라인입니다. 네트워크를 확인해주세요.'),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => controller?.reload(),
                        child: const Text('다시 시도'),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
